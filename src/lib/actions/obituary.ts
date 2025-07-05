// app/actions.ts
"use server";

import { db } from "@/lib/db"; // Your Drizzle DB instance
import { obituaries } from "@/lib/db/schema"; // Your Drizzle schema for obituaries
import { ActionState } from "@/types/state";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { createStreamableValue, StreamableValue } from "ai/rsc";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

interface ObituaryInput {
  fullName: string;
  birthDate: string;
  deathDate: string;
  biographySummary: string;
  accomplishments?: string;
  hobbiesInterests?: string;
  survivedBy?: string;
  predeceasedBy?: string;
  serviceDetails?: string;
  tone?: string;
}

interface ObituaryInputAlt {
  fullName: string;
  birthDate: string;
  deathDate: string;
  biographySummary: string;
  accomplishments?: string;
  hobbiesInterests?: string;
  survivedBy?: string;
  predeceasedBy?: string;
  serviceDetails?: string;
  tone?: string;
  userId: string;
}

export async function generateObituaryAction(
  userId: string,
  formData: FormData
) {
  try {
    // 1. Extract and Validate Data from FormData
    const inputData: ObituaryInput = {
      fullName: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      deathDate: formData.get("deathDate") as string,
      biographySummary: formData.get("biographySummary") as string,
      accomplishments: formData.get("accomplishments") as string,
      hobbiesInterests: formData.get("hobbiesInterests") as string,
      survivedBy: formData.get("survivedBy") as string,
      predeceasedBy: formData.get("predeceasedBy") as string,
      serviceDetails: formData.get("serviceDetails") as string,
      tone: formData.get("tone") as string,
    };

    // Basic server-side validation
    if (
      !inputData.fullName ||
      !inputData.biographySummary ||
      !inputData.birthDate ||
      !inputData.deathDate
    ) {
      return { success: false, error: "Missing required fields." };
    }

    // 2. Prompt Construction
    const prompt = `
        You are an compassionate and eloquent obituary writer. Your task is to write a respectful and heartfelt obituary based on the provided information.

        Deceased Name: ${inputData.fullName}
        Born: ${inputData.birthDate}
        Died: ${inputData.deathDate}

        Biography/Life Summary: ${inputData.biographySummary}

        ${
          inputData.accomplishments
            ? `Key Accomplishments & Achievements: ${inputData.accomplishments}`
            : ""
        }
        ${
          inputData.hobbiesInterests
            ? `Hobbies & Interests: ${inputData.hobbiesInterests}`
            : ""
        }
        ${inputData.survivedBy ? `Survived By: ${inputData.survivedBy}` : ""}
        ${
          inputData.predeceasedBy
            ? `Predeceased By: ${inputData.predeceasedBy}`
            : ""
        }
        ${
          inputData.serviceDetails
            ? `Funeral/Service Details: ${inputData.serviceDetails}`
            : ""
        }

        ${
          inputData.tone
            ? `The desired tone for this obituary is: ${inputData.tone}.`
            : "The tone should be reverent and respectful."
        }

        Please write the obituary. Focus on celebrating their life, contributions, and legacy. Ensure the language is dignified and appropriate.
        Include a starting sentence and an ending sentiment (e.g., "They will be dearly missed.").
        The obituary should be concise but comprehensive, around 200-400 words.
        `;

    // 3. Call LLM API
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o", // Or 'gpt-4-turbo', 'gpt-3.5-turbo'
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    //   max_tokens: 1000,
    // });

    const stream = createStreamableValue("");
    let generatedText = "";
    let tokenUsage = 0;

    (async () => {
      const { textStream } = await streamText({
        // model: openai("gpt-4o"),
        model: anthropic("claude-3-5-sonnet-latest"),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 1000,
        onFinish: ({
          usage,
        }: {
          usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
          };
        }) => {
          const { promptTokens, completionTokens, totalTokens } = usage;
          console.log("Prompt Tokens:", promptTokens);
          console.log("Completion Tokens:", completionTokens);
          console.log("Total Tokens:", totalTokens);
          tokenUsage = totalTokens;
        },
      });
      for await (const delta of textStream) {
        generatedText += delta;
        stream.update(delta);
      }
      stream.done();
      // 4. Save to Database (using Drizzle ORM)
      // You might want to save the raw FormData as JSON if needed later
      await db.insert(obituaries).values({
        fullName: inputData.fullName,
        birthDate: inputData.birthDate,
        deathDate: inputData.deathDate,
        // Store a clean version of inputData, not FormData directly
        inputData: { ...inputData },
        generatedText: generatedText,
        generatedTextClaude: "",
        generatedTextOpenAI: "",
        generatedTextClaudeTokens: tokenUsage,
        generatedTextOpenAITokens: 0,
        userId: userId,
      });
    })();

    // 5. Revalidate path to show the new data (e.g., if you display all generated obituaries)
    // If you only display the *current* generated one, this might not be strictly needed,
    // but useful if you navigate away and come back, or if the page shows a list.
    revalidatePath("/obituaries"); // Revalidate the page where the form is located

    return {
      success: true,
      obituary: stream.value,
    };
  } catch (error: any) {
    console.error("Error generating obituary:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}

export async function generateMultipleObituariesAction(
  userId: string,
  formData: FormData
) {
  try {
    // 1. Extract and Validate Data from FormData
    const inputData: ObituaryInput = {
      fullName: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      deathDate: formData.get("deathDate") as string,
      biographySummary: formData.get("biographySummary") as string,
      accomplishments: formData.get("accomplishments") as string,
      hobbiesInterests: formData.get("hobbiesInterests") as string,
      survivedBy: formData.get("survivedBy") as string,
      predeceasedBy: formData.get("predeceasedBy") as string,
      serviceDetails: formData.get("serviceDetails") as string,
      tone: formData.get("tone") as string,
    };

    // Basic server-side validation
    if (
      !inputData.fullName ||
      !inputData.biographySummary ||
      !inputData.birthDate ||
      !inputData.deathDate
    ) {
      return { success: false, error: "Missing required fields." };
    }

    // 2. Prompt Construction
    const prompt = `
        You are an compassionate and eloquent obituary writer. Your task is to write a respectful and heartfelt obituary based on the provided information.

        Deceased Name: ${inputData.fullName}
        Born: ${inputData.birthDate}
        Died: ${inputData.deathDate}

        Biography/Life Summary: ${inputData.biographySummary}

        ${
          inputData.accomplishments
            ? `Key Accomplishments & Achievements: ${inputData.accomplishments}`
            : ""
        }
        ${
          inputData.hobbiesInterests
            ? `Hobbies & Interests: ${inputData.hobbiesInterests}`
            : ""
        }
        ${inputData.survivedBy ? `Survived By: ${inputData.survivedBy}` : ""}
        ${
          inputData.predeceasedBy
            ? `Predeceased By: ${inputData.predeceasedBy}`
            : ""
        }
        ${
          inputData.serviceDetails
            ? `Funeral/Service Details: ${inputData.serviceDetails}`
            : ""
        }

        ${
          inputData.tone
            ? `The desired tone for this obituary is: ${inputData.tone}.`
            : "The tone should be reverent and respectful."
        }

        Please write the obituary. Focus on celebrating their life, contributions, and legacy. Ensure the language is dignified and appropriate.
        Include a starting sentence and an ending sentiment (e.g., "They will be dearly missed.").
        The obituary should be concise but comprehensive, around 200-400 words.
        `;

    const streamClaude = createStreamableValue("");
    let generatedTextClaude = "";
    let tokenUsageClaude = 0;

    const streamOpenAI = createStreamableValue("");
    let generatedTextOpenAI = "";
    let tokenUsageOpenAI = 0;

    (async () => {
      const { textStream: textStreamClaude } = await streamText({
        // model: openai("gpt-4o"),
        model: anthropic("claude-3-5-sonnet-latest"),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 1000,
      });
      for await (const delta of textStreamClaude) {
        generatedTextClaude += delta;
        streamClaude.update(delta);
      }
      const { textStream: textStreamOpenAI } = await streamText({
        model: openai("gpt-4o"),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 1000,
      });
      for await (const delta of textStreamOpenAI) {
        generatedTextOpenAI += delta;
        streamOpenAI.update(delta);
      }
      streamOpenAI.done();
      streamClaude.done();
      // 4. Save to Database (using Drizzle ORM)
      // You might want to save the raw FormData as JSON if needed later
      await db.insert(obituaries).values({
        fullName: inputData.fullName,
        birthDate: inputData.birthDate,
        deathDate: inputData.deathDate,
        // Store a clean version of inputData, not FormData directly
        inputData: { ...inputData },
        generatedText: "",
        generatedTextClaude: generatedTextClaude,
        generatedTextOpenAI: generatedTextOpenAI,
        generatedTextClaudeTokens: tokenUsageClaude,
        generatedTextOpenAITokens: tokenUsageOpenAI,
        userId: userId,
      });
    })();

    // 5. Revalidate path to show the new data (e.g., if you display all generated obituaries)
    // If you only display the *current* generated one, this might not be strictly needed,
    // but useful if you navigate away and come back, or if the page shows a list.
    revalidatePath("/obituaries"); // Revalidate the page where the form is located

    return {
      success: true,
      claude: streamClaude.value,
      openai: streamOpenAI.value,
    };
  } catch (error: any) {
    console.error("Error generating obituary:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}

export async function generateObituaryText(userId: string, formData: FormData) {
  try {
    // 1. Extract and Validate Data from FormData
    const inputData: ObituaryInput = {
      fullName: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      deathDate: formData.get("deathDate") as string,
      biographySummary: formData.get("biographySummary") as string,
      accomplishments: formData.get("accomplishments") as string,
      hobbiesInterests: formData.get("hobbiesInterests") as string,
      survivedBy: formData.get("survivedBy") as string,
      predeceasedBy: formData.get("predeceasedBy") as string,
      serviceDetails: formData.get("serviceDetails") as string,
      tone: formData.get("tone") as string,
    };

    // Basic server-side validation
    if (
      !inputData.fullName ||
      !inputData.biographySummary ||
      !inputData.birthDate ||
      !inputData.deathDate
    ) {
      return { success: false, error: "Missing required fields." };
    }

    // 2. Prompt Construction
    const prompt = `
        You are an compassionate and eloquent obituary writer. Your task is to write a respectful and heartfelt obituary based on the provided information.

        Deceased Name: ${inputData.fullName}
        Born: ${inputData.birthDate}
        Died: ${inputData.deathDate}

        Biography/Life Summary: ${inputData.biographySummary}

        ${
          inputData.accomplishments
            ? `Key Accomplishments & Achievements: ${inputData.accomplishments}`
            : ""
        }
        ${
          inputData.hobbiesInterests
            ? `Hobbies & Interests: ${inputData.hobbiesInterests}`
            : ""
        }
        ${inputData.survivedBy ? `Survived By: ${inputData.survivedBy}` : ""}
        ${
          inputData.predeceasedBy
            ? `Predeceased By: ${inputData.predeceasedBy}`
            : ""
        }
        ${
          inputData.serviceDetails
            ? `Funeral/Service Details: ${inputData.serviceDetails}`
            : ""
        }

        ${
          inputData.tone
            ? `The desired tone for this obituary is: ${inputData.tone}.`
            : "The tone should be reverent and respectful."
        }

        Please write the obituary. Focus on celebrating their life, contributions, and legacy. Ensure the language is dignified and appropriate.
        Include a starting sentence and an ending sentiment (e.g., "They will be dearly missed.").
        The obituary should be concise but comprehensive, around 200-400 words.
        `;

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 1000,
    });

    await db.insert(obituaries).values({
      fullName: inputData.fullName,
      birthDate: inputData.birthDate,
      deathDate: inputData.deathDate,
      // Store a clean version of inputData, not FormData directly
      inputData: { ...inputData },
      generatedText: text,
      generatedTextClaude: "",
      generatedTextOpenAI: "",
      generatedTextClaudeTokens: 0,
      generatedTextOpenAITokens: 0,
      userId: userId,
    });

    return {
      success: true,
      obituary: text,
    };
  } catch (error) {
    console.error("Error generating obituary text:", error);
    return { error: "Failed to generate obituary text" };
  }
}

export async function updateObituaryText(id: string, text: string) {
  try {
    await db
      .update(obituaries)
      .set({ generatedText: text })
      .where(eq(obituaries.id, id));
    return { result: "Obituary text updated successfully" };
  } catch (error) {
    console.error("Error updating obituary text:", error);
    return { error: "Failed to update obituary text" };
  }
}

export async function saveObituaryDraft(userId: string, formData: FormData) {
  try {
    const inputData: ObituaryInput = {
      fullName: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      deathDate: formData.get("deathDate") as string,
      biographySummary: formData.get("biographySummary") as string,
      accomplishments: formData.get("accomplishments") as string,
      hobbiesInterests: formData.get("hobbiesInterests") as string,
      survivedBy: formData.get("survivedBy") as string,
      predeceasedBy: formData.get("predeceasedBy") as string,
      serviceDetails: formData.get("serviceDetails") as string,
      tone: formData.get("tone") as string,
    };

    await db.insert(obituaries).values({
      fullName: inputData.fullName,
      birthDate: inputData.birthDate,
      deathDate: inputData.deathDate,
      // Store a clean version of inputData, not FormData directly
      inputData: { ...inputData },
      generatedText: "",
      generatedTextClaude: "",
      generatedTextOpenAI: "",
      generatedTextClaudeTokens: 0,
      generatedTextOpenAITokens: 0,
      userId: userId,
    });

    return {
      success: true,
      obituary: "",
    };
  } catch (error) {
    console.error("Error saving obituary draft:", error);
    return { error: "Failed to save obituary draft" };
  }
}

export async function generateObituaryActionAlt(
  initialState: ActionState,
  formData: FormData
): Promise<{ success: boolean; stream?: StreamableValue; error?: string }> {
  try {
    // 1. Extract and Validate Data from FormData
    const inputData: ObituaryInputAlt = {
      fullName: formData.get("fullName") as string,
      birthDate: formData.get("birthDate") as string,
      deathDate: formData.get("deathDate") as string,
      biographySummary: formData.get("biographySummary") as string,
      accomplishments: formData.get("accomplishments") as string,
      hobbiesInterests: formData.get("hobbiesInterests") as string,
      survivedBy: formData.get("survivedBy") as string,
      predeceasedBy: formData.get("predeceasedBy") as string,
      serviceDetails: formData.get("serviceDetails") as string,
      tone: formData.get("tone") as string,
      userId: formData.get("userId") as string,
    };

    // Basic server-side validation
    if (
      !inputData.fullName ||
      !inputData.biographySummary ||
      !inputData.birthDate ||
      !inputData.deathDate
    ) {
      return { success: false, error: "Missing required fields." };
    }

    // 2. Prompt Construction
    const prompt = `
        You are an compassionate and eloquent obituary writer. Your task is to write a respectful and heartfelt obituary based on the provided information.

        Deceased Name: ${inputData.fullName}
        Born: ${inputData.birthDate}
        Died: ${inputData.deathDate}

        Biography/Life Summary: ${inputData.biographySummary}

        ${
          inputData.accomplishments
            ? `Key Accomplishments & Achievements: ${inputData.accomplishments}`
            : ""
        }
        ${
          inputData.hobbiesInterests
            ? `Hobbies & Interests: ${inputData.hobbiesInterests}`
            : ""
        }
        ${inputData.survivedBy ? `Survived By: ${inputData.survivedBy}` : ""}
        ${
          inputData.predeceasedBy
            ? `Predeceased By: ${inputData.predeceasedBy}`
            : ""
        }
        ${
          inputData.serviceDetails
            ? `Funeral/Service Details: ${inputData.serviceDetails}`
            : ""
        }

        ${
          inputData.tone
            ? `The desired tone for this obituary is: ${inputData.tone}.`
            : "The tone should be reverent and respectful."
        }

        Please write the obituary. Focus on celebrating their life, contributions, and legacy. Ensure the language is dignified and appropriate.
        Include a starting sentence and an ending sentiment (e.g., "They will be dearly missed.").
        The obituary should be concise but comprehensive, around 200-400 words.
        `;

    // 3. Call LLM API
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o", // Or 'gpt-4-turbo', 'gpt-3.5-turbo'
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    //   max_tokens: 1000,
    // });

    const stream = createStreamableValue("");
    let generatedText = "";
    let tokenUsage = 0;

    (async () => {
      const { textStream } = await streamText({
        model: openai("gpt-4o"),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 1000,
        onFinish: ({
          usage,
        }: {
          usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
          };
        }) => {
          const { promptTokens, completionTokens, totalTokens } = usage;
          console.log("Prompt Tokens:", promptTokens);
          console.log("Completion Tokens:", completionTokens);
          console.log("Total Tokens:", totalTokens);
          tokenUsage = totalTokens;
        },
      });
      for await (const delta of textStream) {
        generatedText += delta;
        stream.update(delta);
      }
      stream.done();
      // 4. Save to Database (using Drizzle ORM)
      // You might want to save the raw FormData as JSON if needed later
      await db.insert(obituaries).values({
        fullName: inputData.fullName,
        birthDate: inputData.birthDate,
        deathDate: inputData.deathDate,
        // Store a clean version of inputData, not FormData directly
        inputData: { ...inputData },
        generatedText: generatedText,
        generatedTextClaude: "",
        generatedTextOpenAI: "",
        generatedTextClaudeTokens: tokenUsage,
        generatedTextOpenAITokens: 0,
        userId: inputData.userId,
      });
    })();

    // 5. Revalidate path to show the new data (e.g., if you display all generated obituaries)
    // If you only display the *current* generated one, this might not be strictly needed,
    // but useful if you navigate away and come back, or if the page shows a list.
    revalidatePath("/obituaries"); // Revalidate the page where the form is located

    return {
      success: true,
      stream: stream.value,
    };
  } catch (error: any) {
    console.error("Error generating obituary:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}

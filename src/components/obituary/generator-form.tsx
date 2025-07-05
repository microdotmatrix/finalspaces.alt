"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateObituariesAlt,
  saveObituaryFormDraft,
} from "@/lib/actions/ai/generate";
import { readStreamableValue } from "ai/rsc";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner"; // Assuming sonner for toasts
import { AnimatedDatePicker } from "../elements/form/animated-date";
import { AnimatedInput } from "../elements/form/animated-input";
import { Typewriter } from "../elements/typewriter";
import { Icon } from "../ui/icon";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type ActionState = {
  success?: boolean;
  error?: string;
  stream?: {
    claude: ReadableStream;
    openai: ReadableStream;
  };
};

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  location?: string;
}

interface ServiceDetails {
  type: string;
  date?: Date;
  time?: string;
  location?: string;
  address?: string;
  officiant?: string;
}

export function ObituaryGeneratorForm({ userId }: { userId: string }) {
  const [generating, setGenerating] = useState(false);
  const [generatedObituaryOpenAI, setGeneratedObituaryOpenAI] = useState<
    ReadableStream | string
  >();
  const [generatedObituaryClaude, setGeneratedObituaryClaude] = useState<
    ReadableStream | string
  >();
  const [isPending, startTransition] = useTransition();
  const [state, action, pending] = useActionState<ActionState | FormData>(
    generateObituariesAlt,
    {
      success: false,
      error: "",
      obituary: {
        claude: undefined,
        openai: undefined,
      },
    }
  );

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: undefined,
    deathDate: undefined,
    biographySummary: "",
    accomplishments: "",
    hobbiesInterests: "",
    survivedBy: [] as FamilyMember[],
    predeceasedBy: [] as FamilyMember[],
    serviceDetails: "",
    tone: "",
  });

  const addFamilyMember = (type: "survivedBy" | "predeceasedBy") => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
    };

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], newMember],
    }));
  };

  const updateFamilyMember = (
    type: "survivedBy" | "predeceasedBy",
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      ),
    }));
  };

  const removeFamilyMember = (
    type: "survivedBy" | "predeceasedBy",
    id: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((member) => member.id !== id),
    }));
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      fullName: "",
      birthDate: undefined,
      deathDate: undefined,
      biographySummary: "",
      accomplishments: "",
      hobbiesInterests: "",
      survivedBy: [],
      predeceasedBy: [],
      serviceDetails: "",
      tone: "",
    });
  };

  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // This effect runs when the state from useActionState changes
    if (state.stream) {
      setGeneratedObituaryOpenAI(undefined); // Clear previous content
      setGeneratedObituaryClaude(undefined); // Clear previous content
      setIsStreaming(true);
      const readStream = async () => {
        let fullContentOpenAI = "";
        let fullContentClaude = "";
        try {
          for await (const delta of readStreamableValue(
            state.stream?.openai!
          )) {
            fullContentOpenAI += delta;
            setGeneratedObituaryOpenAI(fullContentOpenAI); // Update UI with each delta
          }
          for await (const delta of readStreamableValue(
            state.stream?.claude!
          )) {
            fullContentClaude += delta;
            setGeneratedObituaryClaude(fullContentClaude); // Update UI with each delta
          }
          toast.success("Obituary generated and streamed successfully!");
        } catch (err: any) {
          console.error("Error reading stream:", err);
          toast.error(`Stream error: ${err.message}`);
          setGeneratedObituaryClaude(
            (prev) => prev + `\n\n--- Error: ${err.message} ---`
          ); // Show error in UI
          setGeneratedObituaryOpenAI(
            (prev) => prev + `\n\n--- Error: ${err.message} ---`
          ); // Show error in UI
        } finally {
          setIsStreaming(false);
        }
      };
      readStream();
    } else if (state.error) {
      toast.error(state.error);
      setIsStreaming(false);
      setGeneratedObituaryOpenAI(undefined);
      setGeneratedObituaryClaude(undefined);
    }
  }, [state]); // Depend on the state object returned by useActionState

  const handleSaveDraft = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveObituaryFormDraft(userId, formData);
        toast.success("Obituary draft saved successfully!");
      } catch (error) {
        console.error("Error saving obituary draft:", error);
        toast.error("Failed to save obituary draft");
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-4 relative">
      <section className="flex-2 sticky top-0 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Obituary Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={action} className="grid grid-cols-1 gap-6">
              <div>
                <AnimatedInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="What was their name?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <AnimatedDatePicker
                    date={formData.birthDate}
                    setDate={(date) =>
                      handleInputChange("birthDate", date?.toISOString() || "")
                    }
                    label="Date of Birth"
                  />
                </div>
                <div className="relative">
                  <AnimatedDatePicker
                    date={formData.deathDate}
                    setDate={(date) =>
                      handleInputChange("deathDate", date?.toISOString() || "")
                    }
                    label="Date of Death"
                  />
                </div>
              </div>

              <div>
                <AnimatedInput
                  label="Biographical Summary"
                  name="biographySummary"
                  type="textarea"
                  value={formData.biographySummary}
                  onChange={(e) =>
                    handleInputChange("biographySummary", e.target.value)
                  }
                  placeholder="E.g., early life, education, career, character traits..."
                  className="h-24"
                  required
                />
              </div>

              <div>
                <AnimatedInput
                  label="Accomplishments & Achievements (Optional)"
                  name="accomplishments"
                  type="textarea"
                  value={formData.accomplishments}
                  onChange={(e) =>
                    handleInputChange("accomplishments", e.target.value)
                  }
                  placeholder="E.g., awards, contributions, significant milestones..."
                  className="h-24"
                />
              </div>

              <div>
                <AnimatedInput
                  label="Hobbies & Interests (Optional)"
                  name="hobbiesInterests"
                  type="textarea"
                  value={formData.hobbiesInterests}
                  onChange={(e) =>
                    handleInputChange("hobbiesInterests", e.target.value)
                  }
                  placeholder="E.g., passions, favorite pastimes, unique quirks..."
                  className="h-24"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="survivedBy">Survived By</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFamilyMember("survivedBy")}
                  >
                    <Icon icon="lucide:plus" className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </div>

                {formData.survivedBy.map((member: any) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                  >
                    <Input
                      name="name"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) =>
                        updateFamilyMember(
                          "survivedBy",
                          member.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      name="relationship"
                      placeholder="Relationship"
                      value={member.relationship}
                      onChange={(e) =>
                        updateFamilyMember(
                          "survivedBy",
                          member.id,
                          "relationship",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      name="location"
                      placeholder="Location (optional)"
                      value={member.location || ""}
                      onChange={(e) =>
                        updateFamilyMember(
                          "survivedBy",
                          member.id,
                          "location",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        removeFamilyMember("survivedBy", member.id)
                      }
                    >
                      <Icon icon="lucide:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="predeceasedBy">Preceded in Death By</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFamilyMember("predeceasedBy")}
                  >
                    <Icon icon="lucide:plus" className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </div>

                {formData.predeceasedBy.map((member: any) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                  >
                    <Input
                      name="name"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) =>
                        updateFamilyMember(
                          "predeceasedBy",
                          member.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      name="relationship"
                      placeholder="Relationship"
                      value={member.relationship}
                      onChange={(e) =>
                        updateFamilyMember(
                          "predeceasedBy",
                          member.id,
                          "relationship",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      name="location"
                      placeholder="Location (optional)"
                      value={member.location || ""}
                      onChange={(e) =>
                        updateFamilyMember(
                          "predeceasedBy",
                          member.id,
                          "location",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        removeFamilyMember("predeceasedBy", member.id)
                      }
                    >
                      <Icon icon="lucide:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <AnimatedInput
                  name="serviceDetails"
                  label="Funeral/Memorial Service Details (Optional)"
                  type="textarea"
                  value={formData.serviceDetails}
                  onChange={(e) =>
                    handleInputChange("serviceDetails", e.target.value)
                  }
                  placeholder="E.g., date, time, location of visitation, service, burial..."
                  className="h-24"
                />
              </div>

              <div>
                <Label htmlFor="tone">Desired Tone</Label>
                <RadioGroup
                  defaultValue="reverant"
                  onValueChange={(value) => handleInputChange("tone", value)}
                  className="flex flex-row gap-4 mt-4"
                >
                  <section className="space-y-3 flex-1 [&>div]:gap-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="reverant" id="reverant" />
                      <Label htmlFor="reverant">Reverant</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="funeral" id="funeral" />
                      <Label htmlFor="funeral">Funeral</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="informal" id="informal" />
                      <Label htmlFor="informal">Informal</Label>
                    </div>
                  </section>
                  <section className="space-y-3 flex-1 [&>div]:gap-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="humorous" id="humorous" />
                      <Label htmlFor="humorous">Humorous</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="uplifting" id="uplifting" />
                      <Label htmlFor="uplifting">Uplifting</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="poetic" id="poetic" />
                      <Label htmlFor="poetic">Poetic</Label>
                    </div>
                  </section>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Generating..." : "Generate Obituary"}
                </Button>
                <Button variant="secondary" formAction={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button type="reset" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="flex-3 flex flex-col gap-4 px-4">
        {generatedObituaryOpenAI && generatedObituaryClaude ? (
          <ObituaryOutput
            generatedObituaryOpenAI={generatedObituaryOpenAI}
            generatedObituaryClaude={generatedObituaryClaude}
            setGeneratedObituaryOpenAI={setGeneratedObituaryOpenAI}
            setGeneratedObituaryClaude={setGeneratedObituaryClaude}
          />
        ) : (
          <>
            {!generating && !isPending && (
              <Typewriter
                text="> Complete the form to generate an obituary..."
                repeat={false}
                className="mt-8"
              />
            )}
          </>
        )}
        {generating && (
          <Typewriter
            text={`> Generating an obituary for ${formData.fullName}...`}
            repeat={false}
            className="mt-8"
          />
        )}
      </section>
    </div>
  );
}

function ObituaryOutput({
  generatedObituaryOpenAI,
  generatedObituaryClaude,
  setGeneratedObituaryOpenAI,
  setGeneratedObituaryClaude,
}: {
  generatedObituaryOpenAI?: string;
  generatedObituaryClaude?: string;
  setGeneratedObituaryOpenAI: (value: string) => void;
  setGeneratedObituaryClaude: (value: string) => void;
}) {
  return (
    <>
      <h3 className="font-semibold mb-8">OpenAI:</h3>
      <div className="whitespace-pre-wrap">{generatedObituaryOpenAI}</div>

      <h3 className="font-semibold mb-8">Claude:</h3>
      <div className="whitespace-pre-wrap">{generatedObituaryClaude}</div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => {
            setGeneratedObituaryOpenAI("");
            setGeneratedObituaryClaude("");
          }}
        >
          Clear Output
        </Button>
        {/* Add options to copy, save, etc. here */}
      </div>
    </>
  );
}

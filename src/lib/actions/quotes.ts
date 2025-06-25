"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { savedQuotes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { cache } from "react";

// Type for saved quote identifiers
export type SavedQuoteIdentifier = {
  quote: string;
  author: string;
};

/**
 * Save a quote to the user's saved quotes
 */
export const saveQuote = cache(async (quote: string, author: string) => {
  // Get the current session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return {
      success: false,
      message: "You must be logged in to save quotes",
    };
  }

  try {
    await db.insert(savedQuotes).values({
      userId: session.user.id,
      quote,
      author,
    });

    revalidatePath("/quotes/search");

    return {
      success: true,
      message: "Quote saved successfully",
    };
  } catch (error) {
    console.error("Error saving quote:", error);
    return {
      success: false,
      message: "Failed to save quote",
    };
  }
});

/**
 * Check if a quote is saved by the current user
 * This is kept for backward compatibility but should be avoided in lists
 * where multiple quotes need to be checked
 */
export const isQuoteSaved = cache(async (quote: string, author: string) => {
  // Get the current session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return false;
  }

  try {
    const userId = session.user.id;

    const result = await db.query.savedQuotes.findMany({
      where: and(
        eq(savedQuotes.userId, userId),
        eq(savedQuotes.quote, quote),
        eq(savedQuotes.author, author)
      ),
    });

    // Check if count is greater than 0
    const count = result.length;
    return count > 0;
  } catch (error) {
    console.error("Error checking if quote is saved:", error);
    return false;
  }
});

/**
 * Remove a quote from the user's saved quotes
 */
export const removeQuote = cache(async (quote: string, author: string) => {
  // Get the current session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return {
      success: false,
      message: "You must be logged in to remove quotes",
    };
  }

  try {
    const result = await db
      .delete(savedQuotes)
      .where(
        and(
          eq(savedQuotes.userId, session.user.id),
          eq(savedQuotes.quote, quote),
          eq(savedQuotes.author, author)
        )
      );

    revalidatePath("/quotes/search");

    return {
      success: true,
      message: "Quote removed successfully",
    };
  } catch (error) {
    console.error("Error removing quote:", error);
    return {
      success: false,
      message: "Failed to remove quote",
    };
  }
});

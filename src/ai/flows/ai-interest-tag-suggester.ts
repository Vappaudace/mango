'use server';
/**
 * @fileOverview This file provides an AI-powered interest tag suggestion tool.
 *
 * - suggestInterestTags - A function that suggests interest tags based on a user's bio.
 * - AIInterestTagSuggesterInput - The input type for the suggestInterestTags function.
 * - AIInterestTagSuggesterOutput - The return type for the suggestInterestTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIInterestTagSuggesterInputSchema = z.object({
  bio: z.string().describe("The user's profile biography."),
});
export type AIInterestTagSuggesterInput = z.infer<typeof AIInterestTagSuggesterInputSchema>;

const AIInterestTagSuggesterOutputSchema = z.object({
  interests: z.array(z.string()).describe('An array of suggested interest tags based on the bio.'),
});
export type AIInterestTagSuggesterOutput = z.infer<typeof AIInterestTagSuggesterOutputSchema>;

export async function suggestInterestTags(input: AIInterestTagSuggesterInput): Promise<AIInterestTagSuggesterOutput> {
  return aiInterestTagSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiInterestTagSuggesterPrompt',
  input: { schema: AIInterestTagSuggesterInputSchema },
  output: { schema: AIInterestTagSuggesterOutputSchema },
  prompt: `Based on the following user biography, suggest a list of relevant interest tags. 
Each tag should be a short, concise word or phrase.
Do not include numbers or special characters other than hyphens in tags.
Example tags: 'voyages', 'cuisine', 'musique', 'lecture', 'sport', 'photographie', 'technologie'.

Biography: {{{bio}}}

Output ONLY the JSON object with an array of strings for 'interests'.`,
});

const aiInterestTagSuggesterFlow = ai.defineFlow(
  {
    name: 'aiInterestTagSuggesterFlow',
    inputSchema: AIInterestTagSuggesterInputSchema,
    outputSchema: AIInterestTagSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

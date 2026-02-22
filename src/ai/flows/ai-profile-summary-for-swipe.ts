'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a concise AI summary of a user's profile.
 *
 * - generateProfileSummary - A function that generates an AI-powered summary for a user profile.
 * - ProfileSummaryInput - The input type for the generateProfileSummary function.
 * - ProfileSummaryOutput - The return type for the generateProfileSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileSummaryInputSchema = z.object({
  displayName: z.string().describe('The display name of the user.'),
  age: z.number().describe('The age of the user.'),
  bio: z.string().describe('The user\'s self-description or biography.').optional(),
  interests: z.array(z.string()).describe('A list of the user\'s interests.').optional(),
});
export type ProfileSummaryInput = z.infer<typeof ProfileSummaryInputSchema>;

const ProfileSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "A concise and engaging summary of the user's profile, highlighting key aspects."
    ),
});
export type ProfileSummaryOutput = z.infer<typeof ProfileSummaryOutputSchema>;

export async function generateProfileSummary(
  input: ProfileSummaryInput
): Promise<ProfileSummaryOutput> {
  return aiProfileSummaryForSwipeFlow(input);
}

const profileSummaryPrompt = ai.definePrompt({
  name: 'profileSummaryPrompt',
  input: {schema: ProfileSummaryInputSchema},
  output: {schema: ProfileSummaryOutputSchema},
  prompt: `You are an AI assistant for a dating app called MANGO. Your task is to generate a concise and engaging summary of a user's profile based on their name, age, bio, and interests. This summary will be displayed to other users in the 'Découvrir' section to help them quickly understand the person's personality and make an informed decision to 'Like' or 'Pass'.

Highlight the most interesting and unique aspects. Keep the summary very brief, ideally 1-3 sentences, and conversational.

User Profile:
Name: {{{displayName}}}
Age: {{{age}}} ans

{{#if bio}}
Bio: "{{{bio}}}"
{{/if}}

{{#if interests.length}}
Intérêts: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Generate the summary in French.`,
});

const aiProfileSummaryForSwipeFlow = ai.defineFlow(
  {
    name: 'aiProfileSummaryForSwipeFlow',
    inputSchema: ProfileSummaryInputSchema,
    outputSchema: ProfileSummaryOutputSchema,
  },
  async input => {
    const {output} = await profileSummaryPrompt(input);
    return output!;
  }
);

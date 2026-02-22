'use server';
/**
 * @fileOverview A Genkit flow for generating or refining user profile bios for the MANGO dating app.
 *
 * - generateProfileBio - A function that handles the bio generation/refinement process.
 * - GenerateProfileBioInput - The input type for the generateProfileBio function.
 * - GenerateProfileBioOutput - The return type for the generateProfileBio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProfileBioInputSchema = z.object({
  interests: z.array(z.string()).describe('A list of user interests, hobbies, or passions.'),
  personalityTraits: z.array(z.string()).describe('A list of personality adjectives or characteristics that describe the user.'),
  existingBio: z.string().optional().describe('An optional existing bio text to be refined or used as a base.'),
  maxLength: z.number().optional().default(500).describe('The maximum length for the generated bio in characters. Defaults to 500.'),
});
export type GenerateProfileBioInput = z.infer<typeof GenerateProfileBioInputSchema>;

const GenerateProfileBioOutputSchema = z.object({
  bio: z.string().describe('The generated or refined profile bio.'),
});
export type GenerateProfileBioOutput = z.infer<typeof GenerateProfileBioOutputSchema>;

export async function generateProfileBio(input: GenerateProfileBioInput): Promise<GenerateProfileBioOutput> {
  return generateProfileBioFlow(input);
}

const generateProfileBioPrompt = ai.definePrompt({
  name: 'generateProfileBioPrompt',
  input: { schema: GenerateProfileBioInputSchema },
  output: { schema: GenerateProfileBioOutputSchema },
  prompt: `You are a profile bio writer for a dating app called MANGO. Your goal is to create a concise, engaging, and attractive profile bio that helps the user connect with others.
Based on the following information, generate a compelling bio.
The bio should be friendly, authentic, and highlight the user's best qualities.
It should be suitable for a Francophone African dating app, focusing on authentic connections.
Keep the bio relatively short, within approximately {{maxLength}} characters.

{{#if existingBio}}
Refine this existing bio, making it more engaging and concise while retaining its core message:
"{{{existingBio}}}"
{{/if}}

Consider these interests when writing the bio:
{{#each interests}}
- {{{this}}}
{{/each}}

Consider these personality traits when writing the bio:
{{#each personalityTraits}}
- {{{this}}}
{{/each}}

Please output only the generated bio text, formatted as a JSON object with a single 'bio' key, for example: {"bio": "Your generated bio here."}`
});

const generateProfileBioFlow = ai.defineFlow(
  {
    name: 'generateProfileBioFlow',
    inputSchema: GenerateProfileBioInputSchema,
    outputSchema: GenerateProfileBioOutputSchema,
  },
  async (input) => {
    // Genkit handles default values specified in Zod schema.
    const { output } = await generateProfileBioPrompt(input);
    return output!;
  }
);

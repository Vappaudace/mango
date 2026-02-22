'use server';
/**
 * @fileOverview An AI agent that generates personalized conversation starters ('Jus') for matched users.
 *
 * - generateIcebreakers - A function that generates icebreaker suggestions based on a user's profile.
 * - JusIcebreakerInput - The input type for the generateIcebreakers function.
 * - JusIcebreakerOutput - The return type for the generateIcebreakers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JusIcebreakerInputSchema = z.object({
  bio: z.string().describe("The matched user's biography."),
  interests: z.array(z.string()).describe("A list of the matched user's interests.")
});
export type JusIcebreakerInput = z.infer<typeof JusIcebreakerInputSchema>;

const JusIcebreakerOutputSchema = z.array(z.string()).describe("A list of personalized conversation starters ('Jus').");
export type JusIcebreakerOutput = z.infer<typeof JusIcebreakerOutputSchema>;

export async function generateIcebreakers(input: JusIcebreakerInput): Promise<JusIcebreakerOutput> {
  return jusIcebreakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jusIcebreakerPrompt',
  input: {schema: JusIcebreakerInputSchema},
  output: {schema: JusIcebreakerOutputSchema},
  prompt: `You are a friendly and engaging dating app assistant named MANGO. Your goal is to help users initiate fun and personalized conversations with their new matches.

Based on the matched user's profile information provided below, generate 3-5 distinct, engaging, and personalized conversation starters. These are called 'Jus' in the MANGO app. Make sure they are positive and encourage interaction. Avoid generic greetings.

User's Bio: {{{bio}}}
User's Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Generate the 'Jus' in a JSON array format. Each element in the array should be a string representing a conversation starter.

Examples:
[
  "Ton intérêt pour la photographie est super! As-tu un sujet préféré à capturer?",
  "J'adore ton bio, il y a quelque chose qui me fait penser à...",
  "Si tu devais choisir une seule de tes passions à partager, laquelle serait-ce et pourquoi?"
]

Now, generate the 'Jus' for the user:`
});

const jusIcebreakerFlow = ai.defineFlow(
  {
    name: 'jusIcebreakerFlow',
    inputSchema: JusIcebreakerInputSchema,
    outputSchema: JusIcebreakerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate icebreakers.');
    }
    return output;
  }
);

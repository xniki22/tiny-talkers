import OpenAI from "openai";

import type {
  CustomLearningItemType,
} from "./ICustomLevel";

export interface GeneratedCustomLevelItem {
  text: string;
  type: CustomLearningItemType;
}

export interface GeneratedCustomLevel {
  title: string;
  items: GeneratedCustomLevelItem[];
}

export class CustomLevelAIService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured."
      );
    }

    this.client =
      new OpenAI({
        apiKey,
      });
  }

  async generateLevel(
    childName: string,
    topic: string
  ): Promise<GeneratedCustomLevel> {
    const response =
      await this.client.responses.create({
        model:
          "gpt-5.6-luna",

        input: `
You are helping create speech-learning practice
for a young child between ages 1 and 5.

The parent wants practice about:
"${topic}"

Child name:
"${childName}"

Generate exactly 5 simple practice items.

Rules:
- Content must be child-safe.
- Use short, easy vocabulary.
- Do not include frightening, violent, sexual,
  medical-diagnostic, or otherwise inappropriate content.
- Do not give parenting or medical advice.
- The content is only a draft for the parent to review.
- Include a mixture of WORD, PHRASE, and SENTENCE items.
- WORD should usually be 1 word.
- PHRASE should usually be 2 to 4 words.
- SENTENCE should be short and easy to say.
- Generate a short title.

Return ONLY valid JSON in this exact shape:

{
  "title": "Example Practice",
  "items": [
    {
      "text": "Example",
      "type": "WORD"
    }
  ]
}
        `.trim(),
      });

    const text =
      response.output_text;

    if (!text) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    let parsed:
      GeneratedCustomLevel;

    try {
      parsed =
        JSON.parse(
          text
        ) as GeneratedCustomLevel;
    } catch {
      throw new Error(
        "AI returned invalid JSON."
      );
    }

    this.validateGeneratedLevel(
      parsed
    );

    return parsed;
  }

  private validateGeneratedLevel(
    level: GeneratedCustomLevel
  ): void {
    if (
      !level ||
      typeof level.title !==
        "string" ||
      !level.title.trim()
    ) {
      throw new Error(
        "AI returned an invalid title."
      );
    }

    if (
      level.title.length > 80
    ) {
      throw new Error(
        "AI title is too long."
      );
    }

    if (
      !Array.isArray(
        level.items
      ) ||
      level.items.length !== 5
    ) {
      throw new Error(
        "AI must return exactly 5 items."
      );
    }

    const allowedTypes:
      CustomLearningItemType[] = [
        "WORD",
        "PHRASE",
        "SENTENCE",
      ];

    for (
      const item of level.items
    ) {
      if (
        !item ||
        typeof item.text !==
          "string" ||
        !item.text.trim()
      ) {
        throw new Error(
          "AI returned an invalid item."
        );
      }

      if (
        item.text.length > 120
      ) {
        throw new Error(
          "AI item is too long."
        );
      }

      if (
        !allowedTypes.includes(
          item.type
        )
      ) {
        throw new Error(
          "AI returned an invalid item type."
        );
      }
    }
  }
}
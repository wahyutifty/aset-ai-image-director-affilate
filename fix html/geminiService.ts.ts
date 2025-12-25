
import { GoogleGenAI, Type } from "@google/genai";
import { CampaignData } from "./types";

// Always use a named parameter and obtain the API key directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCampaign = async (productDescription: string, style: string): Promise<CampaignData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a high-converting video campaign for a product with this description: "${productDescription}". The video style should be: ${style}. Return a JSON object with: title, hashtags, script, and a storyboard array of 5 shots. Each shot must have shot_number, visual_prompt (extremely detailed for an AI image generator), and voiceover_script. Ensure the visual_prompts are specialized for 9:16 vertical video.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hashtags: { type: Type.STRING },
          script: { type: Type.STRING },
          storyboard: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                shot_number: { type: Type.NUMBER },
                visual_prompt: { type: Type.STRING },
                voiceover_script: { type: Type.STRING }
              },
              required: ["shot_number", "visual_prompt", "voiceover_script"]
            }
          }
        },
        required: ["title", "hashtags", "script", "storyboard"]
      }
    }
  });

  const rawJson = response.text || "{}";
  const data: CampaignData = JSON.parse(rawJson);

  // Post-process to add platform-specific variations for the visual prompts
  data.storyboard = data.storyboard.map(shot => ({
    ...shot,
    platformPrompts: {
      dreamina: `${shot.visual_prompt}, highly detailed, cinematic lighting, 8k, professional photography, trending on tiktok`,
      grok: `A high-quality 9:16 vertical video still of: ${shot.visual_prompt}. Hyper-realistic, studio setup.`,
      meta: `Create an image for a social media ad. Concept: ${shot.visual_prompt}. Vibrant colors, realistic textures.`
    }
  }));

  return data;
};


export interface StoryboardShot {
  shot_number: number;
  visual_prompt: string;
  voiceover_script: string;
  imageUrl?: string;
  isLoading?: boolean;
  platformPrompts?: {
    dreamina: string;
    grok: string;
    meta: string;
  };
}

export interface CampaignData {
  title: string;
  hashtags: string;
  script: string;
  storyboard: StoryboardShot[];
}

export interface ContentStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  locked: boolean;
}

export interface Recommendation {
  wikipedia_id: string;
  wikipedia_key: string;
  wikipedia_title: string;
  title: string;
  thumbnail: string;
}

export type RecommendationType = string | undefined; 
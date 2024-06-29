import { axios } from "./base";
import { type Recommendation } from "@/types";



export async function getRecommendations(wikipediaKeys: string[], category: string) {
  return await fetch("https://isgzjh3d3gm6tls2z5dmlpsewq0gkokq.lambda-url.us-east-1.on.aws/", {
    method: "POST",
    body: JSON.stringify({
      page_keys: wikipediaKeys,
      item_category: category
    })
  })
  .then(res => res.json())
}
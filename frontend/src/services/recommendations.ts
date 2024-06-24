import { axios } from "./base";
import { type Recommendation } from "@/types";



export async function getRecommendations(wikipediaKeys: string[], category: string) {
  // Temporarily return dummy data
  const data: Recommendation[] = [
    {
      wikipedia_id: '1',
      wikipedia_key: 'Harry_Potter',
      wikipedia_title: 'Harry Potter',
      title: 'Percy Jackson',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg',
    },
    {
      wikipedia_id: '2',
      wikipedia_key: 'Harry_Potter',
      wikipedia_title: 'Harry Potter',
      title: 'Percy Jackson',
      thumbnail: '',
    },
    {
      wikipedia_id: '3',
      wikipedia_key: 'Harry_Potter',
      wikipedia_title: 'Harry Potter',
      title: 'Percy Jackson',
      thumbnail: '',
    },
    {
      wikipedia_id: '4',
      wikipedia_key: 'Harry_Potter',
      wikipedia_title: 'Harry Potter',
      title: 'Percy Jackson',
      thumbnail: '',
    },
    {
      wikipedia_id: '5',
      wikipedia_key: 'Harry_Potter',
      wikipedia_title: 'Harry Potter',
      title: 'Percy Jackson',
      thumbnail: '',
    },
  ]
  return data
}
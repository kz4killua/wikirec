const axios = require('axios').default;


export async function searchTitles(q: string, limit: number) {
  return await axios.get(`https://api.wikimedia.org/core/v1/wikipedia/en/search/title?${
    new URLSearchParams({
      'q': q, 'limit': limit.toString()
    }).toString()
  }`)
}
import React, { useCallback, useRef, useEffect, useState, useMemo } from "react"
import debounce from 'lodash.debounce';
import { searchTitles } from "@/services/search";


export interface SearchResult {
  id: number;
  key: string;
  title: string;
  description: string;
}


export function SearchResults({
  query,
  handleSearchResultClick
} : {
  query: string;
  handleSearchResultClick: (resultItem: SearchResult) => void
}) {

  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // When a result is clicked, clear results before proceeding
  function handleClick(resultItem: SearchResult) {
    setSearchResults([])
    handleSearchResultClick(resultItem)
  }

  // Based on the query, update search results
  function updateSearchResults(query: string) {
    if ((query.length === 0)) {
      setSearchResults([])
    } else {
      searchTitles(query, 5)
      .then(response => {
        setSearchResults(response.data["pages"])
      })
    }
  }

  // https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks/
  const debouncedSearch = useMemo(() =>
    debounce((value) => {
      updateSearchResults(value)
    }, 200)
  , [])

  const debouncedOnChange = useCallback((query: string) => {
      debouncedSearch(query)
    }, 
    [debouncedSearch]
  );

  useEffect(() => {
    debouncedOnChange(query);
    return () => {
        debouncedSearch.cancel();
    };
  }, [query, debouncedOnChange, debouncedSearch]);

  return (
    <ol className={`${(searchResults.length > 0) ? 'absolute' : 'hidden'} bg-white top-full mt-2 border rounded-lg w-full z-50 divide-y`}>
      {
        searchResults.map(resultItem => 
          <li 
            key={resultItem.id}
            className="w-full bg-white py-3 px-4 text-sm rounded-lg cursor-pointer hover:bg-blue-50"
            onClick={() => handleClick(resultItem)}
          >
            <h3 className="font-medium mb-1">
              { resultItem.title }
            </h3>
            <p className="text-gray-600 text-xs">
              { resultItem.description }
            </p>
          </li>
        )
      }
    </ol>
  )
}
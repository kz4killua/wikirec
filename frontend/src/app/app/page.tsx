"use client"

import { Select, SelectTrigger, SelectContent, SelectValue, SelectGroup, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import React, { useRef } from "react"
import { useEffect, useState } from "react"
import { Loader, Search, Trash2 } from "lucide-react"
import { ScrollToTopButton } from "@/components/shared/scroll-to-top-button"
import { searchTitles } from "@/services/search"
import { toast } from "sonner"
import { getRecommendations } from "@/services/recommendations"
import { Recommendation } from "@/types"
import Image from "next/image"
import { Input } from "@/components/ui/input"



interface UserPreference {
  id: number;
  placeholder: string;
  wikipediaKey: string | null;
  wikipediaTitle: string | null;
}

interface SearchResult {
  id: number;
  key: string;
  title: string;
  description: string;
}


export default function App() {

  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const recommendationsRef = useRef<HTMLElement>(null)

  return (
    <div className="overflow-y-auto">
      <Header />
      <main className="pt-40">
        <UserChoices 
          recommendationsRef={recommendationsRef}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
        />
        <RecommendationsList
          recommendationsRef={recommendationsRef}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
        />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}



function UserChoices({
  recommendations, setRecommendations, recommendationsRef
}: {
  recommendations: Recommendation[],
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>,
  recommendationsRef: React.RefObject<HTMLElement>
}) {

  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([
    { 
      id: 1, 
      placeholder: "super awesome movie here...",
      wikipediaKey: null,
      wikipediaTitle: null,
    },
    { 
      id: 2, 
      placeholder: "or maybe your favorite book...",
      wikipediaKey: null,
      wikipediaTitle: null
    },
    { 
      id: 3, 
      placeholder: "or the song that's been on repeat...",
      wikipediaKey: null,
      wikipediaTitle: null
    }
  ])
  const [recommendationType, setRecommendationType] = useState<string>()
  const [loading, setLoading] = useState(false)


  async function handleGetRecommendations() {

    // Get the wikipediaKeys of all selected items
    const wikipediaKeys = userPreferences
    .filter(item => 
      item.wikipediaKey !== null && item.wikipediaKey !== undefined
    )
    .map(item => item.wikipediaKey)

    // Users must have at least one preference
    if (wikipediaKeys.length === 0) {
      toast.error("You must enter at least one movie, book, tv series, song, or game before proceeding.")
      return
    }

    // Users must pick a recommendation type before submitting
    if (!recommendationType) {
      toast.error("Please choose a recommendation type before proceeding.")
      return
    }

    // Make recommendations
    setLoading(true)
    getRecommendations(
      wikipediaKeys as string[], recommendationType
    )
    .then(recommendations => setRecommendations(recommendations))
    .then(() => {
      // Scroll the user to the recommendations section
      recommendationsRef.current?.scrollIntoView({
        behavior: "smooth"
      })
    })
    .finally(() => setLoading(false))
    
  }

  return (
    <section className="max-w-2xl mx-auto pb-24">

      <h1 className="font-extrabold text-center text-5xl mb-14">
        Find your new <span className="text-blue-700">favourites</span>
      </h1>

      <div className="flex flex-col gap-y-2">
        <h4 className="text-sm font-medium">First, tell us what you like.</h4>
        { 
          userPreferences.map(item => 
            <UserPreference 
              key={item.id} 
              preference={item}
              userPreferences={userPreferences}
              setUserPreferences={setUserPreferences}
            />
          ) 
        }
      </div>
      <div className="flex flex-col gap-y-2">
        <h4 className="text-sm font-medium mt-5 mb-2">
          Next, tell us what you are looking for.
        </h4>
        <Select 
          value={recommendationType} 
          onValueChange={(value) => setRecommendationType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="I want to find..." />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="films">movies</SelectItem>
              <SelectItem value="tv-series">tv series</SelectItem>
              <SelectItem value="books">books</SelectItem>
              <SelectItem value="songs">songs</SelectItem>
              <SelectItem value="games">games</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button 
          className="mt-6 flex gap-x-1"
          onClick={handleGetRecommendations}
          disabled={loading}
        >
          {
            loading && 
            <Loader size={12} className="animate-spin"/>
          }
          Get Recommendations 🍿
        </Button>
      </div>
    </section>
  )
}


function SearchResults({
  isFocused,
  query,
  searchResults,
  setSearchResults,
  handleSearchResultClick
} : {
  isFocused: boolean;
  query: string;
  searchResults: SearchResult[],
  setSearchResults: React.Dispatch<React.SetStateAction<SearchResult[]>>,
  handleSearchResultClick: (resultItem: SearchResult) => void
}) {

  return (
    <ol className={`${(searchResults.length > 0) && isFocused ? 'absolute' : 'hidden'} focus:bg-red-500 top-full mt-2 border rounded-lg w-full z-50 divide-y`}>
      {
        searchResults.map(resultItem => 
          <li 
            key={resultItem.id}
            className="w-full bg-white py-3 px-4 text-sm rounded-lg cursor-pointer hover:bg-blue-50"
            onClick={() => handleSearchResultClick(resultItem)}
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


function RecommendationsList({
  recommendationsRef,
  recommendations, 
  setRecommendations
} : {
  recommendationsRef: React.RefObject<HTMLElement>,
  recommendations: Recommendation[],
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>
}) {

  return (
    <section 
      className={`${recommendations.length === 0 ? 'hidden' : ''} py-24 bg-blue-50 scroll-mt-20`}
      ref={recommendationsRef}
    >
      <div>
        <h1 className="font-extrabold text-5xl mb-14 px-20">
          We found some <span className="text-blue-700">movies</span> you'll <span className="text-blue-700">love</span>
        </h1>

        <div className="grid grid-cols-4 gap-10 px-20">
          {
            recommendations.map(
              item => <RecommendationItem item={item} />
            )
          }
        </div>

      </div>
    </section>
  )
}


function RecommendationItem({
  item
}: {
  item: Recommendation
}) {


  function handleClick() {
    const url = `https://www.google.com/search?${
        new URLSearchParams({
          'q': item.title,
        }).toString()
    }`
    window.open(url, "_blank")
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div 
        className="w-full relative h-80 bg-gray-700 rounded-xl border-4 border-gray-400 hover:border-blue-700 transition-colors duration-500 cursor-pointer flex items-center justify-center overflow-hidden"
        onClick={handleClick}
      >
        {
          item.thumbnail &&
          <Image 
          src={item.thumbnail}
          alt={item.title}
          fill
          className=""
          />
        }
      </div>
      <p className="font-bold">
        { item.title }
      </p>
    </div>
  )
}


function UserPreference({ 
  preference, 
  userPreferences,
  setUserPreferences
} : {
  preference: UserPreference, 
  userPreferences: UserPreference[],
  setUserPreferences: React.Dispatch<React.SetStateAction<UserPreference[]>>
}) {

  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  
  const saved = preference.wikipediaKey !== null

  // Keep track of changes to each input query
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  // When the user selects a search result, update the current 'preference'
  function handleSearchResultClick(resultItem: SearchResult) {
    setUserPreferences(userPreferences.map(item => {
      if (item.id === preference.id) {
        return { ...item, wikipediaKey: resultItem.key, wikipediaTitle: resultItem.title  }
      } else {
        return item
      }
    }))
  }

  // Update search results whenever the query changes
  useEffect(() => {
    if ((query.length === 0) || saved) {
      setSearchResults([])
    } else {
      searchTitles(query, 5)
      .then(response => {
        setSearchResults(response.data["pages"])
      })
    }
  }, [query, saved])

  // Allow the user to delete a preference
  function removeUserPreference() {
    setUserPreferences(userPreferences.map(item => {
      if (item.id === preference.id) {
        return { ...item, wikipediaKey: null, wikipediaTitle: null  }
      } else {
        return item
      }
    }))
    setQuery("")
  }

  return (
    <div className="flex w-full items-start space-x-2 relative">
      
      <div 
        className="flex flex-col w-full relative group"
      >
        <Input
          type="text" 
          placeholder={preference.placeholder}
          className="ring-blue-700 disabled:opacity-100"
          onChange={handleInputChange}
          value={query}
          disabled={saved}
          // Add a small delay to give other events time to trigger
          onFocus={() => setTimeout(() => setIsFocused(true), 500)}
          onBlur={() => setTimeout(() => setIsFocused(false), 500)}
        />
        <SearchResults 
          isFocused={isFocused} 
          query={query}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSearchResultClick={handleSearchResultClick}
        />
      </div>

      {
        !saved ? 
        <Button 
          className="flex items-center justify-center"
        >
          <Search size={15} />
        </Button>
        :
        <Button 
          variant={"ghost"} 
          className="flex items-center justify-center"
          onClick={removeUserPreference}
        >
          <Trash2 size={15} />
        </Button>
      }
    </div>
  )
}
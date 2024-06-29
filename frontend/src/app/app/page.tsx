"use client"

import { Select, SelectTrigger, SelectContent, SelectValue, SelectGroup, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import React, { useCallback, useRef, useEffect, useState } from "react"
import { Info, Loader, Search, Trash2 } from "lucide-react"
import { ScrollToTopButton } from "@/components/shared/scroll-to-top-button"
import { searchTitles } from "@/services/search"
import { toast } from "sonner"
import { getRecommendations } from "@/services/recommendations"
import { Recommendation } from "@/types"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { SearchResults, type SearchResult } from "@/components/app/search-results"



interface UserPreference {
  id: number;
  placeholder: string;
  wikipediaKey: string | null;
  wikipediaTitle: string | null;
}


type RecommendationType = string | undefined; 


export default function App() {

  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recommendationType, setRecommendationType] = useState<RecommendationType>()
  const recommendationsRef = useRef<HTMLElement>(null)

  return (
    <div className="overflow-y-auto">
      <Header />
      <main className="pt-40">
        <UserChoices 
          recommendationsRef={recommendationsRef}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          recommendationType={recommendationType}
          setRecommendationType={setRecommendationType}
        />
        <RecommendationsList
          recommendationsRef={recommendationsRef}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          recommendationType={recommendationType}
          setRecommendationType={setRecommendationType}
        />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}



function UserChoices({
  recommendations, 
  setRecommendations, 
  recommendationsRef, 
  recommendationType, 
  setRecommendationType
}: {
  recommendations: Recommendation[],
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>,
  recommendationsRef: React.RefObject<HTMLElement>,
  recommendationType: RecommendationType,
  setRecommendationType: React.Dispatch<React.SetStateAction<RecommendationType>>
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
          <SelectTrigger className={`${recommendationType ? 'bg-blue-50' : ''}`}>
            <SelectValue placeholder="I want to find..." />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="movies">movies</SelectItem>
              <SelectItem value="tv-series">tv series</SelectItem>
              <SelectItem value="books">books</SelectItem>
              <SelectItem value="music">songs</SelectItem>
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


function RecommendationsList({
  recommendationsRef,
  recommendations, 
  setRecommendations,
  recommendationType,
  setRecommendationType
} : {
  recommendationsRef: React.RefObject<HTMLElement>,
  recommendations: Recommendation[],
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>,
  recommendationType: RecommendationType,
  setRecommendationType: React.Dispatch<React.SetStateAction<RecommendationType>>
}) {

  return (
    <section 
      className={`${recommendations.length === 0 ? 'hidden' : ''} py-24 bg-blue-50 scroll-mt-20`}
      ref={recommendationsRef}
    >
      <div>
        <h1 className="font-extrabold text-5xl mb-14 px-20">
          We found some <span className="text-blue-700">{recommendationType}</span> you&apos;ll <span className="text-blue-700">love</span>
        </h1>

        <div className="grid grid-cols-4 gap-10 px-20">
          {
            recommendations.map(
              item => <RecommendationItem key={item.wikipedia_id} item={item} />
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
  const [saved, setSaved] = useState(false)
  const [searching, setSearching] = useState(false)

  // Keep track of changes to each input query
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  // When the user selects a search result, update the current 'preference'
  function handleSearchResultClick(resultItem: SearchResult) {
    setQuery(resultItem.title)
    setSaved(true)
    setUserPreferences(userPreferences.map(item => {
      if (item.id === preference.id) {
        return { ...item, wikipediaKey: resultItem.key, wikipediaTitle: resultItem.title  }
      } else {
        return item
      }
    }))
  }

  // Allow the user to delete a preference
  function removeUserPreference() {
    setQuery("")
    setSaved(false)
    setUserPreferences(userPreferences.map(item => {
      if (item.id === preference.id) {
        return { ...item, wikipediaKey: null, wikipediaTitle: null  }
      } else {
        return item
      }
    }))
  }

  return (
    <div className="flex w-full items-start space-x-2 relative">
      
      <div 
        className="flex flex-col w-full relative group"
      >
        <Input
          type="text" 
          placeholder={preference.placeholder}
          className="ring-blue-700 disabled:opacity-100 disabled:bg-blue-50"
          onChange={handleInputChange}
          value={query}
          disabled={saved}
          // Add a small delay to give other events time to trigger
          onFocus={() => setTimeout(() => setIsFocused(true), 500)}
          onBlur={() => setTimeout(() => setIsFocused(false), 500)}
        />

        {
          (!isFocused && query.length > 0 && !saved) &&
          <p className="flex gap-x-1 items-center text-xs mt-1 text-rose-700">
            <Info size={12} className="fill-rose-700 stroke-white" />
            <span>You must click a valid item from the search list.</span>
          </p>
        }

        {
          (isFocused && !saved) && 
          <SearchResults 
            query={query}
            searching={searching}
            setSearching={setSearching}
            handleSearchResultClick={handleSearchResultClick}
          />
        }
      </div>

      {
        !saved ? 
        <Button 
          className="flex items-center justify-center"
        >
          {
            searching ?
            <Loader size={15} className="animate-spin" />
            :
            <Search size={15} />
          }
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
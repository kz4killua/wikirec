"use client"

import { Select, SelectTrigger, SelectContent, SelectValue, SelectGroup, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { useEffect, useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Check, Ellipsis, LoaderCircle, X } from "lucide-react"
import { ScrollToTopButton } from "@/components/shared/scroll-to-top-button"
import { searchTitles } from "@/services/search"



interface UserPreferenceProps {
  placeholder: string;
  value: string;
}


export default function App() {
  return (
    <div className="overflow-y-auto">
      <Header />
      <main className="pt-40">
        <UserChoices />
        <Recommendations />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}



function UserChoices() {

  const [userPreferences, setUserPreferences] = useState<UserPreferenceProps[]>([
    {
      value: "",
      placeholder: "super awesome movie here...",
    },
    {
      value: "",
      placeholder: "or maybe your favorite book..."
    },
    {
      value: "",
      placeholder: "or the song that's been on repeat..."
    }
  ]);


  // Update the state whenever the user's input changes
  function handleUserPreferencesValueChange(index: number, newValue: string) {
    setUserPreferences(userPreferences.map((item, i) => {
        if (i === index) {
          return { ...item, value: newValue }
        } else {
          return item
        }
      }
    ))
  }

  return (
    <section className="max-w-2xl mx-auto pb-24">

      <h1 className="font-extrabold text-center text-5xl mb-14">
        Find your new <span className="text-blue-700">favourites</span>
      </h1>

      <div className="flex flex-col gap-y-2">
        <h4 className="text-sm font-medium">First, tell us what you like.</h4>
        { 
          userPreferences.map((item, i) => 
            <UserPreference 
              key={i} 
              preference={item}
              index={i}
              onUserPreferenceValueChange={handleUserPreferencesValueChange}
            />
          ) 
        }
      </div>
      <div className="flex flex-col gap-y-2">
        <h4 className="text-sm font-medium mt-5 mb-2">
          Next, tell us what you are looking for.
        </h4>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="I want to find..." />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="film">movies</SelectItem>
              <SelectItem value="tv-series">tv series</SelectItem>
              <SelectItem value="book">books</SelectItem>
              <SelectItem value="song">songs</SelectItem>
              <SelectItem value="game">games</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button 
          className="mt-6"
          type="submit"
        >
          Get Recommendations 🍿
        </Button>
      </div>
    </section>
  )
}


function SearchResults({
  focused, query
} : {
  focused: boolean;
  query: string
}) {

  const [searchResults, setSearchResults] = useState<string[]>([])

  // Update search results whenever the input changes
  useEffect(() => {
    if (query.length === 0 || !focused) {
      setSearchResults([])
    } else {
      searchTitles(query, 5)
      .then(response => {
        setSearchResults(response.data["pages"].map((p: { title: string }) => p.title))
      })
    }
  }, [query, focused])


  return (
    <ol className={`${(query.length > 0) && focused ? 'absolute' : 'hidden'} focus:bg-red-500 top-full mt-2 border rounded-lg w-full z-50 divide-y`}>
      {
        searchResults.map((result, i) => 
          <li className="w-full bg-white py-3 px-4 text-sm rounded-lg cursor-pointer hover:bg-blue-50" key={i}>
            { result }
          </li>
        )
      }
    </ol>
  )
}


function Recommendations() {
  return (
    <section className="py-24 bg-blue-50">
      <div>
        <h1 className="font-extrabold text-5xl mb-14 px-20">
          We found some <span className="text-blue-700">movies</span> you'll <span className="text-blue-700">love</span>
        </h1>

        <div className="grid grid-cols-4 gap-10 px-20">
          <RecommendationItem />
          <RecommendationItem />
          <RecommendationItem />
          <RecommendationItem />
          <RecommendationItem />
        </div>

      </div>
    </section>
  )
}


function RecommendationItem() {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="w-full h-80 bg-gray-700 rounded-xl border-4 border-gray-400 hover:border-blue-700 transition-colors duration-500 cursor-pointer flex items-center justify-center">

      </div>
      <p className="font-bold">
        Federer: Twelve Final Days
      </p>
    </div>
  )
}


function UserPreference({ 
  index, preference, onUserPreferenceValueChange
} : {
  index: number;
  preference: UserPreferenceProps, 
  onUserPreferenceValueChange: (index: number, newValue: string) => void
}
) {

  type UserPreferenceStatus = 'inactive' | 'waiting' | 'loading' | 'found' | 'not-found'
  const [status, setStatus] = useState<UserPreferenceStatus>('inactive')
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex w-full items-start space-x-2 relative">
      
      <div className="flex flex-col w-full relative group">
        <Input 
          type="text" 
          placeholder={preference.placeholder}
          className="ring-blue-700"
          onChange={(event) => onUserPreferenceValueChange(index, event.target.value)}
          value={preference.value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {
          status === 'waiting' ? 
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Ellipsis size={12} className="mr-1" /> waiting for input
          </p>
          : status === 'loading' ?
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <LoaderCircle size={12} className="mr-1" /> searching
          </p>
          : status === 'found' ?
          <p className="text-xs text-emerald-700 flex items-center mt-1">
            <Check size={12} className="mr-1" /> found
          </p>
          : status === 'not-found' ?
          <p className="text-xs text-rose-700 flex items-center mt-1">
            <X size={12} className="mr-1" /> not found
          </p>
          :
          <p></p>
        }
        <SearchResults focused={isFocused} query={preference.value} />
      </div>

      <Select>
        <SelectTrigger className="max-w-[160px]">
          <SelectValue placeholder="item type" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectItem value="film">movie</SelectItem>
            <SelectItem value="tv-series">tv series</SelectItem>
            <SelectItem value="book">book</SelectItem>
            <SelectItem value="song">song</SelectItem>
            <SelectItem value="game">game</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
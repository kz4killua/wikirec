"use client"

import clsx from "clsx"
import Image from "next/image"
import React, { useCallback, useRef, useEffect, useState } from "react"
import { type Recommendation } from "@/types"
import { type RecommendationType } from "@/types"


export function RecommendationsList({
  previousRecommendations, 
  previousRecommendationType,
} : {
  previousRecommendations: Recommendation[],
  previousRecommendationType: RecommendationType,
}) {

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [previousRecommendations])

  return (
    <section 
      className={`${previousRecommendations.length === 0 ? 'hidden' : ''} py-24 px-5 sm:px-20 bg-blue-50 scroll-mt-20`}
      ref={ref}
    >
      <div>
        <h1 className="font-extrabold text-3xl sm:text-5xl text-center sm:text-left mb-14">
          We found some <span className="text-blue-700">{previousRecommendationType}</span> you&apos;ll <span className="text-blue-700">love</span>
        </h1>

        <div 
          className={clsx(
            "grid gap-7 sm:gap-10",
            `${
              previousRecommendationType === "games" ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
            }`
          )}
        >
          {
            previousRecommendations.map(
              item => 
              <RecommendationItem 
                key={item.wikipedia_id} 
                item={item} 
                recommendationType={previousRecommendationType}
                />
            )
          }
        </div>

      </div>
    </section>
  )
}


export function RecommendationItem({
  item,
  recommendationType
}: {
  item: Recommendation,
  recommendationType: RecommendationType
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
        className={clsx(
          "w-full relative bg-gray-700 rounded-xl border-4 border-gray-400 hover:border-blue-700",
          "transition-colors duration-500 cursor-pointer flex items-center justify-center overflow-hidden",
          `${
            recommendationType === "music" ? 'aspect-square' : 
            recommendationType === "games" ? 'aspect-video' :
            'h-60 sm:h-80'
          }`
        )}
        onClick={handleClick}
      >
        {
          item.thumbnail &&
          <Image 
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover object-center"
          />
        }
      </div>
      <p className="font-bold">
        { item.title }
      </p>
    </div>
  )
}

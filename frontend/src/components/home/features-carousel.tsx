"use client"

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoscroll from "embla-carousel-auto-scroll"


export function FeaturesCarousel() {

  const carouselImages = [
    {
      src: "/carousel-book.svg",
      alt: "books"
    },
    {
      src: "/carousel-controller.svg",
      alt: "games"
    },
    {
      src: "/carousel-film.svg",
      alt: "films"
    },
    {
      src: "/carousel-tv.svg",
      alt: "tv-series"
    },
    {
      src: "/carousel-headphones.svg",
      alt: "music"
    }
  ]

  const autoscrollOptions = Autoscroll({
    speed: 1,
  })
  
  return (
  <Carousel 
    className="mt-10"
    opts={{
      loop: true,
    }}
    plugins={[
      autoscrollOptions
    ]}
  >
      <CarouselContent>
        {
          carouselImages.map(item => 
            <CarouselItem className="basis-1/3 flex items-center justify-center" key={item.src}>
              <Image 
                src={item.src}
                alt={item.alt}
                height={200}
                width={200}
                className="grayscale opacity-75"
              />
            </CarouselItem>
          )
        }
      </CarouselContent>
  </Carousel>
  )
}
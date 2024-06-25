import { Icon } from "@/components/shared/icon";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"

import { Laurel } from "@/components/home/laurel";
import { TypingEffect } from "@/components/home/typing-effect";

import { Check, Rocket, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="overflow-y-auto">
      <Header />
      <main>
        <Hero />
        <Features />
        <GetStarted />
        <Footer />
      </main>
    </div>
  );
}


function Hero() {
  return (
    <section className="flex flex-col sm:grid sm:grid-cols-2 bg-blue-500/10 pt-40 px-10">
      <div className="flex flex-col gap-y-8 pb-24 items-center justify-center sm:min-h-dvh text-black">
        <HackathonWin />
        <h1 className="font-extrabold text-3xl sm:text-4xl text-center leading-tight">
          Get recommendations <br /> for anything
        </h1>
        <h2 className="text-center text-lg sm:text-xl font-medium">
          Find books, movies, music, TV series, games and more. <br />
          All in one platform. 🤩
        </h2>
        <div>
          <Link href={"/app"}>
            <Button className="px-12 h-16 rounded-xl">
              <Rocket className="w-5 h-5 mr-2" />
              Get started
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative min-h-64 mb-24">
        <Image 
          src={"/hero-image.svg"} 
          alt="movie recommendations"
          fill
        />
      </div>
    </section>
  )
}


function Features() {

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

  return (
    <section className="py-28">

      <h2 className="text-center font-extrabold text-4xl md:text-5xl tracking-tight mb-12 md:mb-20">
        Tired of searching for new <TypingEffect className="text-blue-700" texts={[
          "books", "movies", "series", "music", "games", "stuff"
        ]} />?
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
        <div className="bg-rose-100/75 text-rose-700 p-8 md:p-12 rounded-lg w-full max-w-md ">
          <h3 className="font-bold text-lg mb-4">Without Wiki Rec 😟</h3>
          <ul className="list-disc list-inside space-y-1.5 ">
            <li className="flex gap-2 items-center">
              <X className="shrink-0" size={12} />
              Use separate sites to find books, movies, games etc.
            </li>
            <li className="flex gap-2 items-center">
              <X className="shrink-0" size={12} />
              No cross category recommendations.
            </li>
            <li className="flex gap-2 items-center">
              <X className="shrink-0" size={12} />
              Manage 12+ different accounts.
            </li>
            <li className="flex gap-2 items-center">
              <X className="shrink-0" size={12} />
              Sign up required.
            </li>
          </ul>
        </div>
        <div className="bg-blue-100/70 text-blue-700 p-8 md:p-12 rounded-lg w-full max-w-md">
          <h3 className="font-bold text-lg mb-4">With Wiki Rec 😎</h3>
          <ul className="list-disc list-inside space-y-1.5 ">
            <li className="flex gap-2 items-center">
              <Check className="shrink-0" size={12} />
              Find books, movies, tv series, games, and music, all in one platform!
            </li>
            <li className="flex gap-2 items-center">
              <Check className="shrink-0" size={12} />
              Get recommendations across categories e.g. find books similar to your favorite movies.
            </li>
            <li className="flex gap-2 items-center">
              <Check className="shrink-0" size={12} />
              Only one account for all your entertainment needs.
            </li>
            <li className="flex gap-2 items-center">
              <Check className="shrink-0" size={12} />
              No sign-up or credit cards required!
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-20">
        <div className="grid grid-cols-5 mt-10 px-10">
          {
            carouselImages.map(item => 
              <div className="p-5 flex items-center justify-center" key={item.src}>
                <Image 
                  src={item.src}
                  alt={item.alt}
                  height={100}
                  width={100}
                  className="grayscale opacity-75"
                />
              </div>
            )
          }
        </div>
      </div>

    </section>
  )
}


function HackathonWin() {
  return (
    <Link
      target="_blank"
      href={"https://www.linkedin.com/posts/ifeanyiobinelo_hackathon-softwareengineering-machinelearning-activity-7066147484007342080-DWqS?utm_source=share&utm_medium=member_desktop"}
    >
      <div className="flex items-center font-medium fill-gray-700 text-gray-700 hover:text-black hover:fill-black">
        <Laurel 
          className=""
        />
        <div className="text-center text-sm">
          Winner of the <br />
          Code in my Bones <br />
          hackathon, 2023 <br />
        </div>
        <Laurel 
          className="scale-x-[-1]"
        />
      </div>
    </Link>
  )
}


function GetStarted() {
  return (
    <section className="py-28 bg-blue-50">
      <h2 className="text-center font-extrabold text-4xl md:text-5xl tracking-tight mb-6">
        So...let&apos;s <span className="text-blue-700">get started</span>.
      </h2>
      <h3 className="text-gray-600 text-xl text-center">
        No sign-up or credit cards required! 😊
      </h3>
      <div className="flex items-center justify-center my-5">
        <Image
          alt="person reading"
          src={"/reading.svg"}
          height={400}
          width={400}
        />
      </div>
      <div className="text-center mt-10">
        <Button className="px-12 h-16 rounded-xl">
          <Rocket className="w-5 h-5 mr-2" />
          Get started
        </Button>
      </div>
    </section>
  )
}
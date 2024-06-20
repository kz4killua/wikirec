import { Icon } from "@/components/shared/icon";
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
    <section className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 bg-blue-500/10">
      <div className="flex flex-col gap-y-8 pt-40 pb-24 px-10 items-center justify-center min-h-dvh text-black">
        <HackathonWin />
        <h1 className="font-extrabold text-4xl text-center leading-tight">
          Get recommendations <br /> for anything
        </h1>
        <h2 className="text-center text-xl font-medium">
          Find books, movies, music, TV series, games, and more. <br />
          All from one platform. 🤩
        </h2>
        <div>
          <Button className="px-12 h-16 rounded-xl">
            <Rocket className="w-5 h-5 mr-2" />
            Get started
          </Button>
        </div>
      </div>

      <div className="relative min-h-40">
        <Image 
          src={"/hero-image.svg"} 
          alt="movie recommendations"
          className="px-10"
          fill
        />
      </div>
    </section>
  )
}


function Header() {
  return (
    <div className="pt-6 px-7 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <header className="w-full h-20 px-7 flex items-center justify-between rounded-xl bg-white shadow-lg border-2 border-blue-500">
        <Link href={"/"}>
          <div className="flex items-center gap-x-3">
            <Icon width={40} height={40} />
            <h1 className="font-bold text-xl">
              Wiki Rec
            </h1>
          </div>
        </Link>

        <Link 
          target="_blank"
          className="hover:underline hover:underline-offset-4"
          href={"https://github.com/kz4killua/wikirec"}
        >
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-5 h-5 mr-2" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View Github
          </div>
        </Link>
      </header>
    </div>
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
              No sign-up required or credit cards required!
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
        So...let's <span className="text-blue-700">get started</span>.
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


function Footer() {
  return (
    <section className="flex flex-col gap-y-6 py-12 px-12 bg-gray-300/50 border-t">
      <div className="flex gap-2 items-center">
        <Icon 
          width={20}
          height={20}
        />
        <div>
          <strong className="font-extrabold tracking-tight text-base md:text-lg">
            Wiki Rec
          </strong>
          <span className="ml-2 text-sm italic">
            (Winner of the 2023 Code in my Bones hackathon!)
          </span>
        </div>
      </div>
      <div className="text-sm underline-offset-4">
        Made by <Link href={"/"} className="font-medium underline underline-offset-4">Ifeanyi</Link>.
        The source code is available on <Link href={"https://github.com/kz4killua/wikirec"} className="font-medium underline">Github</Link>.
      </div>
    </section>
  )
}
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/container";

import { Laurel } from "@/components/home/laurel";
import { TypingEffect } from "@/components/home/typing-effect";

import { Check, Rocket, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/magicui/marquee";


export default function Home() {
  return (
    <div className="overflow-y-auto">
      <Header />
      <main>
        <Hero />
        <Features />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
}


function Hero() {
  return (
    <section className="bg-blue-500/10 pt-40">
      <Container className="flex flex-col sm:grid sm:grid-cols-2">
        <div className="flex flex-col gap-y-8 pb-24 items-center justify-center sm:min-h-dvh text-black">
          <HackathonWin />
          <h1 className="font-extrabold text-3xl sm:text-4xl text-center leading-tight">
            Get recommendations <br /> for anything
          </h1>
          <h2 className="text-center text-lg sm:text-xl font-medium">
            Find books, movies, music, TV series, games and more. <br />
            All in one place. 🤩
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
      </Container>
    </section>
  )
}


function Features() {

  const marqueeImages = [
    {
      src: "/marquee-book.jpg",
      alt: "Books"
    },
    {
      src: "/marquee-game.jpg",
      alt: "Games"
    },
    {
      src: "/marquee-movie.jpg",
      alt: "TV series"
    },
    {
      src: "/marquee-music.jpg",
      alt: "Music"
    },
    {
      src: "/marquee-cinema.jpg",
      alt: "Movies"
    },
  ]

  return (
    <section className="py-24">
      <Container>
        <h2 className="text-center font-extrabold text-3xl sm:text-5xl tracking-tight mb-12 md:mb-20">
          Tired of searching for new <TypingEffect className="text-blue-700" texts={[
            "books", "movies", "series", "music", "games", "stuff"
          ]} />?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
          <div className="bg-rose-100/75 text-rose-700 p-8 md:p-12 rounded-lg w-full max-w-md ">
            <h3 className="font-bold text-lg mb-4">Without Wiki Rec 😟</h3>
            <ul className="list-disc list-inside space-y-1.5 ">
              <li className="flex gap-2 items-center">
                <X className="shrink-0" size={14} />
                Use separate sites to find books, movies, games etc.
              </li>
              <li className="flex gap-2 items-center">
                <X className="shrink-0" size={14} />
                No cross category recommendations.
              </li>
              <li className="flex gap-2 items-center">
                <X className="shrink-0" size={14} />
                Manage 5+ different accounts.
              </li>
              <li className="flex gap-2 items-center">
                <X className="shrink-0" size={14} />
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
                All your entertainment needs in one place.
              </li>
              <li className="flex gap-2 items-center">
                <Check className="shrink-0" size={12} />
                No sign-up or credit cards required!
              </li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <Marquee className="[--duration:60s] mt-10 sm:mt-20">
            {
              marqueeImages.map(item => 
                <div className="relative p-2 flex items-center justify-center" key={item.src}>
                  <Image 
                    src={item.src}
                    alt={item.alt}
                    height={300}
                    width={300}
                    className="rounded-lg aspect-[3/2] w-[200px] sm:w-[300px] object-cover"
                  />
                  <div className="absolute bottom-2 left-0 right-0">
                    <p className="text-white text-center font-medium text-sm pb-2">
                      {item.alt}
                    </p>
                  </div>
                </div>
              )
            }
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white dark:from-background"></div>
        </div>

        <div className="text-center">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-10 mt-10 sm:px-10">
          </div>
        </div>
      </Container>
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
      <Container>
        <h2 className="text-center font-extrabold text-3xl sm:text-5xl tracking-tight mb-6">
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
          <Link href={"/app"}>
            <Button className="px-12 h-16 rounded-xl">
              <Rocket className="w-5 h-5 mr-2" />
              Get started
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
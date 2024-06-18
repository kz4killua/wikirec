import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Laurel } from "@/components/home/laurel";
import { Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}


function Hero() {
  return (
    <section className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 bg-blue-500/10">
      <div className="flex flex-col gap-y-8 pt-40 pb-20 px-10 items-center justify-center min-h-dvh text-black">
        <HackathonWin />
        <h1 className="font-bold text-4xl text-center leading-tight">
          Get recommendations <br /> for anything
        </h1>
        <h2 className="text-center text-xl font-medium">
          Find books, movies, music, TV series, games, and more. <br />
          All from one platform. 
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
    <div className="py-6 px-7 fixed top-0 left-0 right-0 z-50">
      <header className="w-full h-20 px-7 flex items-center rounded-xl bg-white shadow-xl border-2 border-blue-300">
        <Link href={"/"}>
          <div className="flex items-center gap-x-3">
            <Icon width={40} height={40} />
            <h1 className="font-bold text-xl">
              Wiki Rec
            </h1>
          </div>
        </Link>
      </header>
    </div>
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
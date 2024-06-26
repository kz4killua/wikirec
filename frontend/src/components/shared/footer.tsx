import { Icon } from "@/components/shared/icon";
import Link from "next/link"


export function Footer() {
  return (
    <section className="flex flex-col gap-y-6 py-12 px-12 bg-gray-300/50 border-t">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="flex gap-2">
          <Icon 
            width={20}
            height={20}
          />
          <strong className="font-extrabold tracking-tight text-base md:text-lg">
            Wiki Rec
          </strong>
        </div>
        <div className="text-center sm:text-left">
          <span className="text-sm italic">
            (Winner of the 2023 Code in my Bones hackathon!)
          </span>
        </div>
      </div>
      <div className="text-center sm:text-left text-sm underline-offset-4">
        Made by <Link href={"https://github.com/kz4killua"} className="font-medium underline underline-offset-4">Ifeanyi</Link>.
        The source code is available on <Link href={"https://github.com/kz4killua/wikirec"} className="font-medium underline">Github</Link>.
      </div>
    </section>
  )
}
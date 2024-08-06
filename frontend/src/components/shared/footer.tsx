import { Icon } from "@/components/shared/icon";
import Link from "next/link"
import Container from "@/components/shared/container";


export function Footer() {
  return (
    <section className="bg-gray-300/50 border-t">
      <Container className="flex flex-col gap-y-6 py-12 px-12">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2">
            <Icon 
              width={30}
              height={30}
            />
            <strong className="font-extrabold tracking-tight text-base md:text-lg">
              Wiki Rec
            </strong>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-sm">
              (Winner of the 2023 Code in my Bones hackathon!)
            </span>
          </div>
        </div>
        <div className="text-center sm:text-left text-sm underline-offset-4">
          Made with ❤️ by <Link href={"https://www.ifeanyiobinelo.com/"} target="_blank" className="font-medium underline underline-offset-4">Ifeanyi</Link>.
          The source code is available on <Link href={"https://github.com/kz4killua/wikirec"} target="_blank" className="font-medium underline">Github</Link>.
        </div>
      </Container>
    </section>
  )
}
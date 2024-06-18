import Image from "next/image";


export function Icon({
  width, height
}: {
  width: number, height: number
}) {
  return (
    <Image
      src={"/logo.png"}
      alt="WikiRec icon"
      width={width}
      height={height}
    />
  )
}
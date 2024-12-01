import { playfair, lora, sourceSerif } from "@/lib/fonts";
import Link from "next/link";
import { RiAlignLeft } from "react-icons/ri";

export default function Header() {
  return (
    <div className="text-center flex justify-between mt-6 max-w-screen-md m-auto">
      <div className="w-10 h-10 text-2xl flex justify-center items-center">
        <Link href="/">
          <RiAlignLeft />
        </Link>
      </div>
      <h1
        className={`${playfair.className} font-bold text-2xl md:text-4xl text-burgundy pb-6 flex justify-center gap-2 items-center leading-6 w-[200px] md:w-full`}
      >
        <span>🎄</span>
        <span>Christmas Songbook</span>
        <span>🎶</span>
      </h1>
      <div className="w-10"></div>
    </div>
  );
}

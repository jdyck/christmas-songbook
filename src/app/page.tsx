import PageDesign from "@/components/PageDesign";
import Header from "@/components/Header";
import Link from "next/link";
import SongList from "@/components/SongList";

export default function Home() {
  return (
    <>
      <PageDesign>
        <div>
          <Header />
          <SongList />
        </div>
      </PageDesign>
      <Link className="m-auto block text-center mb-12" href="/admin">
        Admin
      </Link>
    </>
  );
}

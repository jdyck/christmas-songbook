import ABCRenderer from "./ABCRenderer";
import Link from "next/link";

export default function SongPage({ params }: { params: { handle: string } }) {
  const { handle } = params;

  return (
    <div>
      <Link href="/">back</Link>
      <div className="md:max-w-screen-md bg-white m-auto sm:p-4 md:p-8 pb-20">
        <ABCRenderer handle={handle} />
      </div>
    </div>
  );
}

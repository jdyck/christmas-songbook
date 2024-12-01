import Header from "@/components/Header";
import ABCRenderer from "./ABCRenderer";

export default function SongPage({ params }: { params: { handle: string } }) {
  const { handle } = params;

  return (
    <div>
      <Header />
      <div className="md:max-w-screen-md bg-white m-auto sm:p-4 md:p-8 pb-20 min-h-[70vh]">
        <ABCRenderer handle={handle} />
      </div>
    </div>
  );
}

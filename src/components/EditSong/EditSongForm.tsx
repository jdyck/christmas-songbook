import { Song } from "@/interfaces/Song";

interface Props {
  song: Song;
  setSong: (song: Song) => void;
  onSave: (updatedSong: Song) => Promise<void>;
  loading: boolean;
  error: string;
}

export default function EditSongForm({
  song,
  setSong,
  onSave,
  loading,
  error,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(song);
      }}
    >
      {/* Form Fields */}
      <input
        className="w-full p-1 mb-4 px-2"
        type="text"
        placeholder="Title"
        value={song.title}
        onChange={(e) => setSong({ ...song, title: e.target.value })}
        required
      />
      {/* Repeat similar fields for other properties */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-lg px-3 py-1.5 mr-4"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

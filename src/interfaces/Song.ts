export interface Song {
  title: string;
  subtitle: string | null;
  handle: string;
  composer: string | null;
  lyricist: string | null;
  key: string | null;
  lyrics: string | null;
  abc_music: string | null;
  meter: string | null;
  length: string | null;
  published: boolean;
}

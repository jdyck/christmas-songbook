export type Song = {
  id: string;
  title: string;
  subtitle: string | null;
  handle: string;
  composer: string;
  lyricist: string;
  key: string;
  lyrics: string | null;
  abc_music: string;
  meter: string;
  length: string;
  published: boolean;
};

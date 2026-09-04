export interface BookDetail {
  isbn: string;
  title: string;
  authors: string;
  translators: string;
  publisher: string | null;
  pubDate: string;
  description: string | null;
  thumbnail: string | null;
  coverImage: string | null;
  subTitle: string | null;
  totalPage: string;
  url: string | null;
  stockStatus: string | null;
}

export interface BookSummary {
  isbn: string;
  title: string;
  authors: string;
  translators: string;
  status: string | null;
  pubDate: string;
  publisher: string | null;
  thumbnail: string | null;
  description: string | null;
}
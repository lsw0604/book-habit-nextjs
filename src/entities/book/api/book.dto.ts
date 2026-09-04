/** GET /books/detail/{isbn} — 알라딘 단건 조회(`AladinLookupResDto`) */
export interface BookDetailDTO {
  isbn: string;
  title: string;
  authors: string[];
  translators: string[];
  publisher: string | null;
  pubDate: string | null;
  description: string | null;
  thumbnail: string | null;
  coverImage: string | null;
  subTitle: string | null;
  totalPage: number | null;
  url: string | null;
  stockStatus: string | null;
}

/** GET /books?query= 응답 아이템(`KakaoBookItemDto`) */
export interface BookSummaryDTO {
  isbn: string;
  title: string;
  authors: string[];
  translators: string[];
  description: string | null;
  pubDate: string | null;
  publisher: string | null;
  thumbnail: string | null;
  status: string | null;
}

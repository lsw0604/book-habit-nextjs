import { BookSummary } from "@/entities/book";
import { ResponsePagination } from "@/shared/api";

export enum Sort {
  ACCURACY = "accuracy",
  LATEST = "latest",
}

export enum Target {
  TITLE = "title",
  ISBN = "isbn",
  PUBLISHER = "publisher",
  PERSON = "person",
}

export type SearchBook = ResponsePagination<BookSummary>;

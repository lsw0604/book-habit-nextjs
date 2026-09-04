import type { BookDetailDTO, BookSummaryDTO } from "../api";
import type { BookDetail, BookSummary } from "../model";

import {
  formatAuthor,
  formatDescription,
  formatISBN,
  formatPubDate,
  formatTotalPage,
  formatTranslator,
} from "./book.formatter";

export const toDetailBookViewModel = (dto: BookDetailDTO): BookDetail => {
  const { isbn, pubDate, authors, translators, description, totalPage, ...rest } = dto;

  return {
    ...rest,
    isbn: formatISBN(isbn),
    pubDate: formatPubDate(pubDate),
    authors: formatAuthor(authors),
    translators: formatTranslator(translators),
    description: formatDescription(description),
    totalPage: formatTotalPage(totalPage),
  };
};

export const toSummaryBookViewModel = (dto: BookSummaryDTO): BookSummary => {
  const { isbn, pubDate, authors, translators, description, ...rest } = dto;

  return {
    ...rest,
    isbn: formatISBN(isbn),
    pubDate: formatPubDate(pubDate),
    authors: formatAuthor(authors),
    translators: formatTranslator(translators),
    description: formatDescription(description),
  };
};

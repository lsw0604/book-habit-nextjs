import { BookSummaryDTO } from "@/entities/book";
import { ResponsePagination } from "@/shared/api";

export type SearchBookDTO = ResponsePagination<BookSummaryDTO>;

import { useFormWithSchema } from "@/shared/hooks";
import {
  DEFAULT_SEARCH_BOOK_PARAMS,
  searchBookParamsSchema,
  type SearchBookParams,
} from "../model";

export const useSearchBookForm = (initialValue?: SearchBookParams) =>
  useFormWithSchema(searchBookParamsSchema, {
    defaultValues: initialValue ?? DEFAULT_SEARCH_BOOK_PARAMS,
  });

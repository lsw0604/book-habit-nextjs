import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { MyBookListParamsDTO } from "./my-book.dto";

export const myBookQueryKeys = createQueryKeys("my-book", {
  list: (params: MyBookListParamsDTO) => ({
    queryKey: [params],
  }),
  detail: (id: number) => ({
    queryKey: [id],
  }),
  byIsbn: (isbn: string) => ({
    queryKey: [isbn],
  }),
});

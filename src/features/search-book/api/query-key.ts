import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { SearchBookParams } from "../model";

export const searchBookQueryKeys = createQueryKeys("search-book", {
  list: (params: SearchBookParams) => ({ queryKey: [params] }),
});

import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ReadingLogListParamsDTO } from "./reading-log.dto";

export const readingLogQueryKeys = createQueryKeys("reading-log", {
  list: (params: ReadingLogListParamsDTO) => ({
    queryKey: [params],
  }),
  detail: (id: number) => ({
    queryKey: [id],
  }),
});

import { API_ENDPOINTS, apiClient } from "@/shared/api";
import type { ResponsePagination } from "@/shared/api";

import type {
  ReadingLogDetailDTO,
  ReadingLogListItemDTO,
  ReadingLogListParamsDTO,
} from "./reading-log.dto";

export interface ReadingLogService {
  fetchReadingLogs: (
    params: ReadingLogListParamsDTO,
  ) => Promise<ResponsePagination<ReadingLogListItemDTO>>;
  fetchReadingLogDetail: (id: number) => Promise<ReadingLogDetailDTO>;
}

export const readingLogService: ReadingLogService = {
  fetchReadingLogs: async (params) =>
    await apiClient.get<ResponsePagination<ReadingLogListItemDTO>>(
      API_ENDPOINTS.READING_LOG.ROOT,
      { params },
    ),
  fetchReadingLogDetail: async (id) =>
    await apiClient.get<ReadingLogDetailDTO>(
      API_ENDPOINTS.READING_LOG.BY_ID(id),
    ),
};

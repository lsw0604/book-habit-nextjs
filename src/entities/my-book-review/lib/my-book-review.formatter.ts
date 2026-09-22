import { formatDate } from "@/shared/lib";

export const formatMyBookReviewDate = (value: string): string =>
  formatDate(value, "medium");

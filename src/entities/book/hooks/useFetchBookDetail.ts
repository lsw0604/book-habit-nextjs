import { useQuery } from '@tanstack/react-query';

import type { APIError } from '@/shared/api';

import { bookQueryKeys, bookService, type BookDetailDTO } from '../api';
import { toDetailBookViewModel } from '../lib';
import type { BookDetail } from '../model';

export const useFetchBookDetail = (isbn: string) => {
  const { fetchBookDetail } = bookService;

  return useQuery<BookDetailDTO, APIError, BookDetail>({
    queryKey: bookQueryKeys.isbn(isbn).queryKey,
    queryFn: () => fetchBookDetail(isbn),
    select: toDetailBookViewModel,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });
};

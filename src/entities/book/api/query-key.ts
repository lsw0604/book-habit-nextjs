import { createQueryKeys } from '@lukemorales/query-key-factory';

export const bookQueryKeys = createQueryKeys('book', {
  isbn: (isbn: string) => ({
    queryKey: [isbn],
  }),
});


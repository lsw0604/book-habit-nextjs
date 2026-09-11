import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMyBookService, RequestAddMyBookDTO } from "../api";
import { MyBookDetailDTO, myBookQueryKeys } from "@/entities/my-book";
import { APIError } from "@/shared/api";

export function useAddMyBook() {
  const { addMyBook } = addMyBookService;
  const queryClient = useQueryClient();

  return useMutation<
    MyBookDetailDTO,
    APIError,
    RequestAddMyBookDTO,
    { previous: MyBookDetailDTO | null | undefined }
  >({
    mutationFn: (payload) => addMyBook(payload),
    onMutate: async (payload) => {
      const existKey = myBookQueryKeys.byIsbn(payload.isbn).queryKey;
      await queryClient.cancelQueries({ queryKey: existKey });

      const previous = queryClient.getQueryData<MyBookDetailDTO | null>(
        existKey,
      );

      return { previous };
    },
    onError: (_err, payload, context) => {
      if (context) {
        queryClient.setQueryData(
          myBookQueryKeys.byIsbn(payload.isbn).queryKey,
          context.previous,
        );
      }
    },
    onSuccess: (response, payload) => {
      queryClient.invalidateQueries({ queryKey: myBookQueryKeys.list._def });
      queryClient.setQueryData(
        myBookQueryKeys.byIsbn(payload.isbn).queryKey,
        response,
      );
      queryClient.setQueryData(
        myBookQueryKeys.detail(response.id).queryKey,
        response,
      );
    },
  });
}

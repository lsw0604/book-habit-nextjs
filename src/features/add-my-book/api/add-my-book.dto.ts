import { MyBookStatus } from "@/entities/my-book";

export interface RequestAddMyBookDTO {
  isbn: string;
  status: MyBookStatus;
}

import {
  MY_BOOK_STATUS,
  MyBookButton,
  MyBookStatus,
} from "@/entities/my-book";
import { BookCheck, BookmarkPlus, BookOpen, LucideIcon } from "lucide-react";

import { useAddMyBook } from "../hooks";

const MY_BOOK_BUTTONS: { status: MyBookStatus; icon: LucideIcon; label: string }[] = [
  { status: MY_BOOK_STATUS.WANT_TO_READ, icon: BookmarkPlus, label: "읽고 싶어요" },
  { status: MY_BOOK_STATUS.CURRENTLY_READING, icon: BookOpen, label: "읽는 중" },
  { status: MY_BOOK_STATUS.READ, icon: BookCheck, label: "읽었어요" },
];

/**
 * `MyBookShelfStatus`의 `children` 자리에 끼워 넣는 걸 전제로 한다. 그
 * 자리가 이제 이 버튼 3개만 채우므로(안내 문구 없음), 패널·제목 없이 3등분
 * grid로 폭을 꽉 채운다 — 버튼 라벨(읽고 싶어요/읽는 중/읽었어요) 자체가
 * "아직 안 담았다"는 걸 이미 말하고 있어 별도 문구가 필요 없다.
 */
export function AddMyBookActions({ isbn }: { isbn: string }) {
  const { mutate, isPending } = useAddMyBook();

  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {MY_BOOK_BUTTONS.map(({ status, icon, label }) => (
        <MyBookButton
          key={status}
          icon={icon}
          label={label}
          disabled={isPending}
          onClick={() => mutate({ isbn, status })}
        />
      ))}
    </div>
  );
}

import { cva } from "class-variance-authority";

export const datepickerVariants = cva(
  [
    "flex",
    "items-center",
    "gap-1",
    "h-11",
    "px-2",
    "rounded-lg",
    "border",
    "bg-transparent",
    "transition-all",
    "duration-200",
    "focus-within:ring-3",
  ],
  {
    variants: {
      error: {
        true: "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        false:
          "border-input focus-within:border-ring focus-within:ring-ring/20",
      },
      disabled: {
        true: "bg-disabled cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  },
);

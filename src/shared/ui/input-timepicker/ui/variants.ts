import { cva } from "class-variance-authority";

export const timepickerVariants = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "w-auto",
    "h-11",
    "px-2",
    "text-base",
    "text-foreground",
    "text-center",
    "font-mono",
    "border",
    "rounded-lg",
    "bg-transparent",
    "transition-all",
    "duration-200",
    "focus-within:ring-3",
  ],
  {
    variants: {
      error: {
        true: "border-destructive text-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        false:
          "border-input focus-within:border-ring focus-within:ring-ring/20",
      },
      disabled: {
        true: "bg-disabled text-muted-foreground cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  },
);

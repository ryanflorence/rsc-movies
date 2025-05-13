"use client";
import { useFormStatus } from "react-dom";

export function AddToFavoritesButton({ isLiked }: { isLiked: boolean }) {
  let { data, pending } = useFormStatus();
  if (data?.get("intent") === "add") {
    isLiked = true;
  } else if (data?.get("intent") === "remove") {
    isLiked = false;
  }

  return (
    <button
      type="submit"
      onClick={event => {
        if (pending) event.preventDefault();
      }}
      className="font-instrumentSans font-semibold rounded-xl w-full text-xl border-[2px] py-2 px-5 group"
    >
      <span className="group-hover:scale-105 group-active:scale-100 inline-block transition-transform duration-100">
        {isLiked ? "Remove from favorites" : "Add to favorites"}
      </span>
    </button>
  );
}

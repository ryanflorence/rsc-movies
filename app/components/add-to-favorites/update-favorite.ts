"use server";

import { addFavorite, removeFavorite } from "../../favorites.ts";

export async function updateFavorite(formData: FormData) {
  let movieId = formData.get("id");
  let intent = formData.get("intent");
  if (intent === "add") {
    await addFavorite(Number(movieId));
  } else {
    await removeFavorite(Number(movieId));
  }
}

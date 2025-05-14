"use server";

import { addSessionFavorite, removeSessionFavorite } from "../../favorites.ts";

export async function updateFavorite(formData: FormData) {
  let movieId = formData.get("id");
  let intent = formData.get("intent");
  if (intent === "add") {
    await addSessionFavorite(Number(movieId));
  } else {
    await removeSessionFavorite(Number(movieId));
  }
}

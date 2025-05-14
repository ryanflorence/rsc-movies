import { updateFavorite } from "./update-favorite.ts";
import { isSessionFavorite } from "../../favorites.ts";
import { AddToFavoritesButton } from "./button.tsx";

export async function AddToFavoritesForm({ movieId }: { movieId: number }) {
  let liked = await isSessionFavorite(movieId);
  return (
    <form action={updateFavorite}>
      <input type="hidden" name="id" value={movieId} />
      <input type="hidden" name="intent" value={liked ? "remove" : "add"} />
      <AddToFavoritesButton isLiked={liked} />
    </form>
  );
}

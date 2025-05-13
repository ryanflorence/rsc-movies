import { updateFavorite } from "../../actions/favorite-movies.ts";
import { isFavorite } from "../../favorites.ts";
import { AddToFavoritesButton } from "./button";

export async function AddToFavoritesForm({ movieId }: { movieId: number }) {
  let liked = await isFavorite(movieId);
  return (
    <form action={updateFavorite}>
      <input type="hidden" name="id" value={movieId} />
      <input type="hidden" name="intent" value={liked ? "remove" : "add"} />
      <AddToFavoritesButton isLiked={liked} />
    </form>
  );
}

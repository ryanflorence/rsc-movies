import { session } from "./session";

export async function isFavorite(movieId: number) {
  let favorites = session().get("favorites") || [];
  return favorites.includes(movieId);
}

export async function addFavorite(movieId: number) {
  let favorites = session().get("favorites") || [];
  favorites.push(movieId);
  session().set("favorites", favorites);
}

export async function removeFavorite(movieId: number) {
  let favorites = session().get("favorites") || [];
  favorites = favorites.filter((id: number) => id !== movieId);
  session().set("favorites", favorites);
}

export async function getFavorites() {
  return session().get("favorites") || [];
}

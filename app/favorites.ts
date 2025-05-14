import { addFavorite, getFavorites, removeFavorite, isFavorite } from "./db";
import { session } from "./session";

export async function addSessionFavorite(movieId: number) {
  let sessionId = session().get("_id");
  addFavorite(sessionId, movieId);
}

export async function removeSessionFavorite(movieId: number) {
  let sessionId = session().get("_id");
  removeFavorite(sessionId, movieId);
}

export async function isSessionFavorite(movieId: number) {
  let sessionId = session().get("_id");
  return isFavorite(sessionId, movieId);
}

export async function getSessionFavorites() {
  let sessionId = session().get("_id");
  return getFavorites(sessionId);
}

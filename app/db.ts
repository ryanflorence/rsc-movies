import Database from "better-sqlite3";
import { batch } from "@ryanflorence/batch-loader";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { type unstable_MiddlewareFunction as MiddlewareFunction } from "react-router";

export const db = new Database(
  process.env.NODE_ENV === "production"
    ? "/data/database.sqlite"
    : path.join(process.cwd(), "database.sqlite"),
);

db.pragma("journal_mode = WAL");
db.prepare("DELETE FROM favorites").run();

/**
 * Async context to load data from anywhere in the app
 */
let context = new AsyncLocalStorage<ReturnType<typeof createLoaders>>();

/**
 * React Router middleware to provide the context to the app
 */
export const dataMiddleware: MiddlewareFunction<Response> = async (_, next) => {
  let loaders = createLoaders();
  return new Promise(resolve => {
    context.run(loaders, () => {
      resolve(next());
    });
  });
};

/**
 * Create the batched/cached loading functions so queries are naturally
 * efficient regardless of the UI on the page (solves n+1 queries and
 * refetching, based on GraphQL DataLoader)
 */
function createLoaders() {
  return {
    movie: batch(batchMovies),
    actor: batch(batchActors),
  };
}

/**
 * Helper to load data from anywhere during a request (provided by the
 * middleware)
 */
export function load() {
  return context.getStore() as ReturnType<typeof createLoaders>;
}

/**
 * Batch function to load multiple movies by id
 */
async function batchMovies(ids: number[]) {
  let placeholders = ids.map(() => "?").join(",");
  // order by year
  let query = `
    SELECT 
      m.*,
      JSON_GROUP_ARRAY(DISTINCT mg.genre_id) as genre_ids,
      JSON_GROUP_ARRAY(DISTINCT mc.cast_id) as cast_ids
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN movie_cast mc ON m.id = mc.movie_id
    WHERE m.id IN (${placeholders})
    GROUP BY m.id
   `;

  return db
    .prepare(query)
    .all(ids)
    .map((movie: any) => {
      movie.genre_ids = JSON.parse(movie.genre_ids);
      movie.cast_ids = JSON.parse(movie.cast_ids);
      return movie as Movie;
    })
    .sort(
      // batch function results must be sorted in the same order as the input
      (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
    );
}

/**
 * Batch function to load multiple actors by id
 */
async function batchActors(ids: number[]) {
  let placeholders = ids.map(() => "?").join(",");
  let query = `
    SELECT
      actor.*,
      GROUP_CONCAT(
        DISTINCT mc.movie_id
        ORDER BY movie.year DESC
      ) as movie_ids
    FROM cast_members as actor
    LEFT JOIN movie_cast mc ON actor.id = mc.cast_id
    LEFT JOIN movies movie ON mc.movie_id = movie.id
    WHERE actor.id IN (${placeholders})
    GROUP BY actor.id
  `;
  return db
    .prepare(query)
    .all(ids)
    .map((actor: any) => {
      actor.movie_ids = actor.movie_ids
        ? actor.movie_ids.split(",").map(Number)
        : [];
      return actor as Actor;
    })
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
}

export function getFavorites(sessionId: string) {
  return db
    .prepare("SELECT * FROM favorites WHERE session_id = ?")
    .all(sessionId)
    .map((favorite: any) => favorite.movie_id);
}

export function addFavorite(sessionId: string, movieId: number) {
  let alreadyFavorite = isFavorite(sessionId, movieId);
  if (alreadyFavorite) {
    return true;
  }
  return db
    .prepare("INSERT INTO favorites (session_id, movie_id) VALUES (?, ?)")
    .run(sessionId, movieId);
}

export function removeFavorite(sessionId: string, movieId: number) {
  return db
    .prepare("DELETE FROM favorites WHERE session_id = ? AND movie_id = ?")
    .run(sessionId, movieId);
}

export function isFavorite(sessionId: string, movieId: number) {
  let result = db
    .prepare("SELECT id FROM favorites WHERE session_id = ? AND movie_id = ?")
    .get(sessionId, movieId);
  return result !== undefined;
}

export type Movie = {
  id: number;
  title: string;
  year: number;
  href: string;
  extract: string;
  thumbnail: string;
  thumbnail_width: string;
  thumbnail_height: string;
  genre_ids: number[];
  cast_ids: number[];
};

export type Actor = {
  id: number;
  name: string;
  movie_ids: number[];
};

export type Favorite = {
  id: number;
  movie_id: number;
  session_id: string;
};

import Database from "better-sqlite3";
import { batch } from "@ryanflorence/batch-loader";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { type unstable_MiddlewareFunction as MiddlewareFunction } from "react-router";

export const db = new Database(path.join(process.cwd(), "database.sqlite"));
let context = new AsyncLocalStorage<ReturnType<typeof createLoaders>>();

export const dataMiddleware: MiddlewareFunction<Response> = async (_, next) => {
  console.log("dataMiddleware");
  let loaders = createLoaders();
  return new Promise(resolve => {
    context.run(loaders, () => {
      resolve(next());
    });
  });
};

// function to load data from anywhere in the app
export function load() {
  return context.getStore() as ReturnType<typeof createLoaders>;
}

////////////////////////////////////////////////////////////////////////////////
function createLoaders() {
  return {
    movie: batch(batchMovies),
    actor: batch(batchActors),
  };
}

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

export async function getRandomMovies() {
  let query = `
    SELECT id FROM movies
    WHERE year > 2000
    ORDER BY RANDOM()
    LIMIT 6
  `;
  return db
    .prepare(query)
    .all()
    .map((movie: any) => movie.id);
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

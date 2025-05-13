import { data } from "react-router";
import { ActorLink } from "../components/actor-link";
import { load, Movie } from "../db";
import { Route } from "./+types/movie";
import { AddToFavoritesForm } from "../components/add-to-favorites/form";

export async function loader({ params }: Route.LoaderArgs) {
  let movie = await load().movie(Number(params.id));
  if (!movie) {
    throw data(null, {
      status: 404,
      statusText: "Movie not found",
    });
  }

  return { movie };
}

export async function ServerComponent({ loaderData }: Route.ComponentProps) {
  let { movie } = loaderData;

  return (
    <div className="w-5xl mx-auto flex gap-x-12">
      <div className="w-[296px] flex-none flex flex-col gap-y-2">
        <img
          src={movie.thumbnail}
          className="w-full h-[435px] object-cover mb-4"
        />
        <AddToFavoritesForm movieId={movie.id} />
      </div>

      <div className="flex-1 flex flex-col gap-y-8">
        <h1 className="font-instrumentSerif leading-[125%] text-6xl">
          {movie.title}
        </h1>

        <p>{movie.extract}</p>

        <div className="flex flex-col gap-y-2">
          <div className="font-bold text-xl">Cast</div>
          <div>
            {movie.cast_ids.map((id, index, arr) => (
              <span key={id}>
                <ActorLink id={id} />
                {index < arr.length - 1 && " • "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

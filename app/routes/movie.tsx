import { data } from "react-router";
import { Route } from "./+types/movie";
import { load } from "../db";
import { ActorLink } from "../components/actor-link";
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
    <>
      <title>{movie.title}</title>
      <meta name="description" content={movie.extract} />

      <div className="p-12 items-center flex flex-col gap-y-12 lg:items-start lg:w-5xl lg:mx-auto lg:flex-row lg:gap-x-12">
        <div className="w-[296px] flex-none flex flex-col gap-y-2">
          <img src={movie.thumbnail} className="h-[435px] object-cover mb-4" />
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
    </>
  );
}

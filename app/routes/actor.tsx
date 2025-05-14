import { load } from "../db";
import { MovieTile } from "../components/movie-tile";
import { Route } from "./+types/actor";
import { MovieGrid } from "../components/movie-grid";

export async function ServerComponent({ params }: Route.ComponentProps) {
  let actor = await load().actor(Number(params.id));

  return (
    <>
      <title>{actor.name}</title>
      <div className="flex flex-col gap-15">
        <div className="flex flex-col gap-2 ">
          <div className="font-bold text-center">Starring</div>
          <h1 className="text-center font-instrumentSerif text-6xl">
            {actor.name}
          </h1>
        </div>
        <MovieGrid>
          {actor.movie_ids.map(id => (
            <MovieTile key={id} id={id} />
          ))}
        </MovieGrid>
      </div>
    </>
  );
}

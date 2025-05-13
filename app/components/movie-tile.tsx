import { Link } from "react-router";
import { load } from "../db";
import { ActorLink } from "./actor-link";
import { AddToFavoritesForm } from "./add-to-favorites/form";

export async function MovieTile({ id }: { id: number }) {
  let movie = await load().movie(id);

  return (
    <div className="w-[296px] flex flex-col gap-y-9">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={movie.thumbnail || "https://picsum.photos/150/225"}
          className="w-full h-[435px] object-cover mb-4"
          alt={movie.title}
        />
      </Link>

      <AddToFavoritesForm movieId={movie.id} />

      <h2 className="font-instrumentSerif text-3xl">
        <Link to={`/movie/${movie.id}`} className="hover:underline">
          {movie.title}
        </Link>{" "}
        ({movie.year})
      </h2>

      <p className="mb-2">
        {movie.extract.length > 500
          ? movie.extract.slice(0, 500) + "..."
          : movie.extract}
      </p>

      <p>
        <b className="font-semibold">Starring</b>:{" "}
        {movie.cast_ids.map((id, index, arr) => (
          <span key={id}>
            <ActorLink id={id} />
            {index < arr.length - 1 && <span className="mx-1">•</span>}
          </span>
        ))}
      </p>
    </div>
  );
}

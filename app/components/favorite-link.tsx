import { Link } from "react-router";
import { load } from "../db";

export async function FavoriteLink({ id }: { id: number }) {
  let movie = await load().movie(id);
  return (
    <Link to={`/movie/${movie.id}`}>
      <img src={movie.thumbnail} className="w-[112px] h-[162px] object-cover" />
    </Link>
  );
}

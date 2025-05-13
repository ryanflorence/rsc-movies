import { MovieGrid } from "../components/movie-grid.tsx";
import { MovieTile } from "../components/movie-tile.tsx";

export async function ServerComponent() {
  let featuredMovieIds = [30895, 31472, 33411, 32932, 23643, 29915];
  return (
    <MovieGrid>
      {featuredMovieIds.map((id: number) => (
        <MovieTile key={id} id={id} />
      ))}
    </MovieGrid>
  );
}

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("movie/:id", "routes/movie.tsx"),
  route("actor/:id", "routes/actor.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;

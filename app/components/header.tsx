import { Link } from "react-router";

export function Header() {
  return (
    <div className="text-5xl text-center p-12 bg-black text-white dark:bg-white dark:text-black font-boldonse mb-22">
      <Link to="/">RSC Movies</Link>
    </div>
  );
}

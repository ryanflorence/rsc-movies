import { Link } from "react-router";
import { load } from "../db";

export async function ActorLink({ id }: { id: number }) {
  let actor = await load().actor(id);
  if (!actor) return null;
  return (
    <Link to={`/actor/${actor.id}`} className="text-[#1458E1] hover:underline">
      {actor.name}
    </Link>
  );
}

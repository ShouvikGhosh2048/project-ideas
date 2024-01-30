import { sql } from "@vercel/postgres";
import { Idea } from "./lib/definitions";
import IdeaCard from "./components/IdeaCard";

export default async function Home() {
  const ideas = (await sql`SELECT * FROM project_ideas`).rows as Idea[];

  return (
    <main className="p-5 flex flex-wrap justify-center gap-10">
      {ideas.map((idea, i) => <IdeaCard key={i} idea={idea}/>)}
    </main>
  );
}

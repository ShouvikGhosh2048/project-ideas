import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { Idea } from "../lib/definitions";
import { IdeaCard } from "../components/IdeaCard";

export default async function Profile() {
    const authResult = await auth();
    if (!authResult || !authResult.user) {
        redirect("/");
    }

    const user = authResult.user;
    const userIdeas = (await sql`SELECT id, title, description
    FROM project_ideas WHERE creator = ${user.id}`).rows as Idea[];

    return (
        <div className="p-5 space-y-5">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-2xl font-bold">Ideas</p>
            <div className="flex flex-wrap gap-10">
                {userIdeas.map((idea, i) => <IdeaCard key={i} idea={idea} />)}
            </div>
        </div>
    )
}
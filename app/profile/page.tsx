import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { Idea } from "../lib/definitions";
import IdeaCard from "../components/IdeaCard";

export default async function Profile() {
    const authResult = await auth();
    if (!authResult || !authResult.user) {
        redirect("/");
    }
    const user = authResult.user;

    const getUserIdeas = async () => {
        const queryResult = await sql`SELECT id, title, description
        FROM project_ideas WHERE creator = ${user.id};`;
        return queryResult.rows as Idea[];
    }
    const getLikedIdeas = async () => {
        const queryResult = await sql`SELECT id, title, description
        FROM project_ideas, project_likes WHERE project_id = id AND user_id = ${user.id};`;
        return queryResult.rows as Idea[];
    }

    const [userIdeas, likedIdeas] = await Promise.all([getUserIdeas(), getLikedIdeas()]);

    return (
        <div className="p-5 space-y-5">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-2xl font-bold">Your ideas</p>
            <div className="flex flex-wrap gap-10">
                {userIdeas.map((idea, i) => <IdeaCard key={i} idea={idea} />)}
            </div>
            <p className="text-2xl font-bold">Liked ideas</p>
            <div className="flex flex-wrap gap-10">
                {likedIdeas.map((idea, i) => <IdeaCard key={i} idea={idea} />)}
            </div>
        </div>
    )
}
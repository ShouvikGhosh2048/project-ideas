import DescriptionMarkdown from "@/app/components/DescriptionMarkdown";
import { Idea, IdeaWithCreator } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";

export default async function Idea({ params }: { params: { id: string }}) {
    const { id } = params;

    // Check that the id is a number.
    if (id === 'NaN' || `${parseInt(id)}` !== id) {
        notFound();
    }

    const ideaQuery = await sql`SELECT project_ideas.id, title, description, username
        FROM project_ideas, project_idea_users
        WHERE creator = project_idea_users.id AND project_ideas.id = ${id};`;
    if (ideaQuery.rows.length === 0) {
        notFound();
    }
    const idea = ideaQuery.rows[0] as IdeaWithCreator;

    return (
        <div className="p-5 space-y-5">
            <p className="text-3xl font-bold">{idea.title}</p>
            <p>Creator: {idea.username}</p>
            <DescriptionMarkdown text={idea.description} />
        </div>
    );
}
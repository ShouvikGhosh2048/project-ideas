import DescriptionMarkdown from "@/app/components/DescriptionMarkdown";
import { Idea } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";

export default async function Idea({ params }: { params: { id: string }}) {
    const { id } = params;

    // Check that the id is a number.
    if (id === 'NaN' || `${parseInt(id)}` !== id) {
        notFound();
    }

    const ideaQuery = await sql`SELECT title, description FROM project_ideas WHERE id = ${id};`;
    if (ideaQuery.rows.length === 0) {
        notFound();
    }
    const idea = ideaQuery.rows[0] as Idea;

    return (
        <div className="p-5 space-y-5">
            <p className="text-3xl font-bold">{idea.title}</p>
            <DescriptionMarkdown text={idea.description} />
        </div>
    );
}
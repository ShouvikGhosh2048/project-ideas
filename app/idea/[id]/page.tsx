import DescriptionMarkdown from "@/app/components/DescriptionMarkdown";
import { Idea, IdeaWithCreatorUsername } from "@/app/lib/definitions";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "./deleteButton";
import { deleteIdea } from "@/app/lib/actions";

export default async function Idea({ params }: { params: { id: string }}) {
    const { id } = params;

    // Check that the id is a number.
    if (id === 'NaN' || `${parseInt(id)}` !== id) {
        notFound();
    }

    const ideaQuery = await sql`SELECT project_ideas.id, title, description, username, creator
        FROM project_ideas, project_idea_users
        WHERE creator = project_idea_users.id AND project_ideas.id = ${id};`;
    if (ideaQuery.rows.length === 0) {
        notFound();
    }
    const idea = ideaQuery.rows[0] as IdeaWithCreatorUsername & { creator: string };

    const authResult = await auth();
    const userId = authResult?.user?.id;

    const deleteIdeaWithId = deleteIdea.bind(null, id);
    return (
        <div className="p-5 space-y-5">
            <p className="text-3xl font-bold">{idea.title}</p>
            <p>Creator: {idea.username}</p>
            {userId === idea.creator && (
                <div className="flex items-center gap-3">
                    <Link href={`/idea/${id}/edit`} className="bg-slate-200 rounded px-5 py-1.5">Edit</Link>
                    <DeleteButton action={deleteIdeaWithId}/>
                </div>
            )}
            <DescriptionMarkdown text={idea.description} />
        </div>
    );
}
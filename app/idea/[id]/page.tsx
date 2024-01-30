import DescriptionMarkdown from "@/app/components/DescriptionMarkdown";
import { Idea, IdeaWithCreatorUsername } from "@/app/lib/definitions";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "./deleteButton";
import { deleteIdea } from "@/app/lib/actions";
import LikeButton from "@/app/components/LikeButton";

export default async function Idea({ params }: { params: { id: string } }) {
    const { id } = params;

    // Check that the id is a number.
    if (id === 'NaN' || `${parseInt(id)}` !== id) {
        notFound();
    }

    const getUserAndWhetherUserLiked = async () => {
        const authResult = await auth();
        const userId = authResult?.user?.id;
        if (userId == undefined) {
            return [userId, false] as [undefined | string, boolean];
        }

        const likeResult
            = await sql`SELECT COUNT(*) FROM project_likes WHERE user_id = ${userId} AND project_id = ${id}`;
        return [userId, likeResult.rows[0].count !== '0'] as [undefined | string, boolean];
    };

    const getIdea = async () => {
        const ideaQuery = await sql`SELECT project_ideas.id, title, description, username, creator
            FROM project_ideas, project_idea_users
            WHERE creator = project_idea_users.id AND project_ideas.id = ${id};`;

        if (ideaQuery.rowCount === 0) {
            return null;
        }
        return ideaQuery.rows[0] as IdeaWithCreatorUsername & { creator: string };
    }

    const [[userId, userLiked], idea] = await Promise.all([getUserAndWhetherUserLiked(), getIdea()]);
    if (idea === null) {
        notFound();
    }

    const deleteIdeaWithId = deleteIdea.bind(null, id);
    return (
        <div className="p-5 space-y-5">
            <p className="text-3xl font-bold">{idea.title}</p>
            <p>Creator: {idea.username}</p>
            <div className="flex items-center gap-3">
                {userId === idea.creator && (
                    <>
                        <Link href={`/idea/${id}/edit`} className="bg-slate-200 rounded px-5 py-1.5">Edit</Link>
                        <DeleteButton action={deleteIdeaWithId} />
                    </>
                )}
                {userId !== undefined && (
                    <LikeButton projectId={id} initialState={userLiked} />
                )}
            </div>
            <DescriptionMarkdown text={idea.description} />
        </div>
    );
}
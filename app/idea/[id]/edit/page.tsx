import IdeaForm from "@/app/components/IdeaForm";
import { editIdea } from "@/app/lib/actions";
import { IdeaWithCreatorId } from "@/app/lib/definitions";
import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { notFound, redirect } from "next/navigation";

export default async function EditIdeaForm({ params }: { params: { id: string } }) {
    const authResult = await auth();
    if (!authResult || !authResult.user) {
        redirect("/");
    }
    const user = authResult.user;

    const ideaQuery = await sql`SELECT * FROM project_ideas WHERE id = ${params.id};`;
    if (ideaQuery.rows.length === 0) {
        notFound();
    }
    const idea = ideaQuery.rows[0] as IdeaWithCreatorId;

    if (idea.creator !== user.id) {
        return <p className="my-20 text-center text-3xl">You are not authorized to edit this idea.</p>;
    }

    const editActionWithId = editIdea.bind(null, params.id);
    return (
        <div className="max-w-xl mx-auto p-10">
            <p className="text-center text-3xl mb-5">Edit idea</p>
            <IdeaForm action={editActionWithId}
                initialTitle={idea.title} initialDescription={idea.description} create={false}/>
        </div>
    );
}
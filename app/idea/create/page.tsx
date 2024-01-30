import IdeaForm from "@/app/components/IdeaForm";
import { createIdea } from "@/app/lib/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateIdea() {
    const authResult = await auth();
    if (!authResult || !authResult.user) {
        redirect('/');
    }
    const user = authResult.user;

    return (
        <div className="max-w-xl mx-auto p-10">
            <p className="text-center text-3xl mb-5">Create new idea</p>
            <IdeaForm action={createIdea} create={true}/>
        </div>
    );
}
import { auth } from "@/auth";
import CreateIdeaForm from "./CreateIdeaForm";
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
            <CreateIdeaForm/>
        </div>
    );
}
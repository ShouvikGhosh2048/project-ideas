"use client";

import Dialog from "@/app/components/Dialog";
import { IdeaDeleteState } from "@/app/lib/actions";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

interface DeleteButtonProps {
    action: () => Promise<IdeaDeleteState>,
}

interface DeleteFormElementsProps {
    setDialogOpen: Dispatch<SetStateAction<boolean>>,
}

function DeleteFormElements({ setDialogOpen }: DeleteFormElementsProps) {
    const { pending } = useFormStatus();
    console.log(pending);

    return (
        <>
            <p>Are you sure that you want to delete this idea?</p>
            <div className="mt-7 flex justify-between">
                <input type="submit" className={`text-white rounded px-5 py-1.5 ${pending ? "bg-slate-500" : "bg-slate-900"}`}
                    value="Delete" disabled={pending} onClick={(e) => {e.stopPropagation()}}/>
                <button type="button" className={`text-white rounded px-5 py-1.5 ${pending ? "bg-slate-500" : "bg-slate-900"}`}
                    onClick={() => { setDialogOpen(false); }}
                    disabled={pending}>Cancel</button>
            </div>
        </>
    );
};

interface DeleteFormProps {
    action: () => Promise<IdeaDeleteState>,
    setDialogOpen: Dispatch<SetStateAction<boolean>>,
}

function DeleteForm({ action, setDialogOpen }: DeleteFormProps) {
    const [formState, dispatch] = useFormState(action, { message: null });

    return (
        <form className="bg-white p-10 rounded border bg-slate-50 border-slate-500"
            action={dispatch}>
            { formState.message !== null 
            && <div className="border border-rose-700 rounded bg-rose-100 p-2 mx-10 mb-5">{formState.message}</div> }
            <DeleteFormElements setDialogOpen={setDialogOpen}/>
        </form>
    );
}

export default function DeleteButton({ action }: DeleteButtonProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <button className="bg-slate-200 rounded px-5 py-1.5"
                onClick={(e) => { e.stopPropagation(); setDialogOpen(true); }}>Delete</button>
            {dialogOpen && (
                <Dialog setOpen={setDialogOpen}>
                    <DeleteForm action={action} setDialogOpen={setDialogOpen}/>
                </Dialog>
            )}
        </>
    );
}
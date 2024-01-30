"use client";

import { useState } from "react";
import { IdeaFormState } from "../lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import DescriptionMarkdown from "@/app/components/DescriptionMarkdown";

interface MarkdownEditorProps {
    disabled: boolean,
    initialDescription?: string,
};

function DescriptionEditor({ disabled, initialDescription }: MarkdownEditorProps) {
    const [showResult, setShowResult] = useState(false);
    const [text, setText] = useState(initialDescription ?? '');

    return (
        <div>
            <div>
                <button className={`w-1/2 py-2 ${showResult ? '' : 'bg-slate-400'}`}
                    disabled={disabled} onClick={() => { setShowResult(false); }} type="button">Edit Markdown</button>
                <button className={`w-1/2 py-2 ${showResult ? 'bg-slate-400' : ''}`}
                    disabled={disabled} onClick={() => { setShowResult(true); }} type="button">View Markdown</button>
            </div>
            <textarea name="description"
                placeholder="Description (500 characters)"
                className={`border border-slate-400 rounded w-full p-2 ${showResult ? 'hidden' : ''}`}
                rows={7} disabled={disabled}
                value={text} onChange={(e) => { setText(e.target.value); }}/>
            {showResult && <div className="border border-slate-400 rounded w-full p-2"><DescriptionMarkdown text={text} /></div>}
        </div>
    )
}

// This is a seperate component since useFormStatus requires this.
interface CreateFormInputsProps {
    state: IdeaFormState,
    initialTitle?: string,
    initialDescription?: string,
    create: boolean,
};

function CreateFormInputs({ state, initialTitle, initialDescription, create }: CreateFormInputsProps) {
    const { pending } = useFormStatus();

    return (
        <>
            {state.message && state.message.length > 0 &&
                <p className="border border-rose-700 rounded bg-rose-100 p-2 mx-10">{state.message}</p>}
            {state.errors?.title &&
                state.errors.title.map((error, i) =>
                    <p key={i} className="border border-rose-700 rounded bg-rose-100 p-2 mx-10">{error}</p>)}
            <div>
                <input name="title"
                    className="border border-slate-400 rounded w-full p-2"
                    placeholder="Title (150 characters)"
                    defaultValue={initialTitle}
                    required disabled={pending}/>
            </div>
            {state.errors?.description &&
                state.errors.description.map((error, i) =>
                    <p key={i} className="border border-rose-700 rounded bg-rose-100 p-2 mx-10">{error}</p>)}
            <div>
                <DescriptionEditor disabled={pending} initialDescription={initialDescription}/>
            </div>
            <div className="flex justify-center">
                <input type="submit" className={`${pending ? "bg-slate-500" : "bg-slate-900"} text-white px-3 py-2 rounded cursor-pointer`}
                        value={create ? "Create idea" : "Edit idea"} disabled={pending}/>
            </div>
        </>
    );
}

interface IdeaFormProps {
    action: (prevState: IdeaFormState, formData: FormData) => Promise<IdeaFormState>,
    initialTitle?: string,
    initialDescription?: string,
    create: boolean,
};

export default function IdeaForm({ action, initialTitle, initialDescription, create }: IdeaFormProps) {
    const [state, dispatch] = useFormState(action, {
        message: null as null,
        errors: {}
    } as IdeaFormState);

    return (
        <form action={dispatch} className="space-y-5">
            <CreateFormInputs state={state}
                initialTitle={initialTitle} initialDescription={initialDescription}
                create={create}/>
        </form>
    );
}
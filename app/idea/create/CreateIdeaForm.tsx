"use client";

import { useState } from "react";
import { CreateIdeaState, createIdea } from "../../lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import DescriptionMarkdown from "@/app/components/DescriptionMarkdown";

function MarkdownEditor({ disabled }: { disabled: boolean}) {
    const [showResult, setShowResult] = useState(false);
    const [text, setText] = useState('');

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
function CreateFormInputs({ state }: { state: CreateIdeaState }) {
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
                    required disabled={pending}/>
            </div>
            {state.errors?.description &&
                state.errors.description.map((error, i) =>
                    <p key={i} className="border border-rose-700 rounded bg-rose-100 p-2 mx-10">{error}</p>)}
            <div>
                <MarkdownEditor disabled={pending}/>
            </div>
            <div className="flex justify-center">
                <input type="submit" className={`${pending ? "bg-slate-500" : "bg-slate-900"} text-white px-3 py-2 rounded cursor-pointer`}
                        value="Create idea" disabled={pending}/>
            </div>
        </>
    );
}

export default function CreateIdeaForm() {
    const [state, dispatch] = useFormState(createIdea, {
        message: null as null,
        errors: {}
    } as CreateIdeaState);

    return (
        <form action={dispatch} className="space-y-5">
            <CreateFormInputs state={state} />
        </form>
    );
}
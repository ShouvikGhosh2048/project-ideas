"use client";

import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { createLike, deleteLike } from "../lib/actions";

interface LikeButtonProps {
    projectId: string,
    initialState: boolean,
}

export default function LikeButton({ projectId, initialState }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialState);

    if (liked) {
        const deleteLikeWithId = deleteLike.bind(null, projectId);
        return (
            <form action={deleteLikeWithId} onSubmit={() => {
                setLiked(false);
            }}>
                <button className="border bg-slate-900 text-white rounded px-2 py-2"><FaThumbsUp/></button>
            </form>
        );
    }
    else {
        const createLikeWithId = createLike.bind(null, projectId);
        return (
            <form action={createLikeWithId} onSubmit={() => {
                setLiked(true);
            }}>
                <button className="border border-slate-200 rounded px-2 py-2"><FaThumbsUp/></button>
            </form>
        );
    }
}
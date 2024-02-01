"use client";

import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { createLike, deleteLike } from "../lib/actions";

interface LikeButtonProps {
    projectId: string,
    defaultLiked: boolean,
    defaultLikeCount: number, 
}

export default function LikeButton({ projectId, defaultLiked, defaultLikeCount }: LikeButtonProps) {
    const [liked, setLiked] = useState(defaultLiked);

    if (liked) {
        const deleteLikeWithId = deleteLike.bind(null, projectId);
        const likeCount = defaultLiked ? defaultLikeCount : (defaultLikeCount + 1);
        return (
            <span className="flex gap-3 items-center">
                <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>
                <form action={deleteLikeWithId} onSubmit={() => {
                    setLiked(false);
                }}>
                    <button className="border bg-slate-900 text-white rounded px-2 py-2"><FaThumbsUp/></button>
                </form>
            </span>
        );
    }
    else {
        const createLikeWithId = createLike.bind(null, projectId);
        const likeCount = defaultLiked ? (defaultLikeCount - 1) : defaultLikeCount;
        return (
            <span className="flex gap-3 items-center">
                <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>
                <form action={createLikeWithId} onSubmit={() => {
                    setLiked(true);
                }}>
                    <button className="border border-slate-200 rounded px-2 py-2"><FaThumbsUp/></button>
                </form>
            </span>
        );
    }
}
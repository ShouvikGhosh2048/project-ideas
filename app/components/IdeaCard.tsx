import Link from "next/link";
import { ReactNode } from "react";
import { Idea } from "../lib/definitions";

function TitleSVG({ title }: { title: string }) {
    const colors = ['black', '#dc2626', '#0284c7', '#16a34a', '#9333ea', '#db2777'];
    const a = 137290127301;
    const b = 912379012739;

    let curr = 0;
    for (let i = 0; i < title.length; i++) {
        curr = (a * curr + title.charCodeAt(i)) % b;
    }

    const color = colors[curr % colors.length];
    const svgRects: ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (curr % 2 == 1) {
                svgRects.push(<rect x={i / 5} y={j / 5} width={0.21} height={0.21} fill={color} key={5 * i + j} />);
            }
            curr = Math.floor(curr / 2);
            if (curr === 0) {
                curr = a;
            }
        }
    }

    return (
        <svg className="w-40 mb-5" viewBox="0 0 1 1">
            {svgRects}
        </svg>
    );
}

export default function IdeaCard({ idea }: { idea: Idea }) {
    return (
        <Link href={`/idea/${idea.id}`}>
            <div className="w-52 flex flex-col items-center hover:bg-slate-100 p-2 rounded">
                <TitleSVG title={idea.title} />
                <span className="break-words text-center">{idea.title}</span>
            </div>
        </Link>
    );
}
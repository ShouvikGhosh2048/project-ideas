import Markdown from "react-markdown";
import './DescriptionMarkdown.css';

export default function DescriptionMarkdown({ text }: { text: string }) {
    return (
        <div className="descriptionMarkdown">
            <Markdown>{ text }</Markdown>
        </div>
    )
}
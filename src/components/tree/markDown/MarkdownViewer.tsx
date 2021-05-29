import React, { useRef } from "react";
import "./MarkdownViewer.css";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

interface Props {
  data: any;
  handleEdit?: Function;
  hideEditButton?: boolean;
}

export default function MarkdownViewer({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="MarkDownViewer" ref={containerRef}>
      <div className="MarkDownContent preview-container">
        <ReactMarkdown
          source={data || ""}
          escapeHtml={false}
          renderers={{ code: CodeBlock }}
        />
      </div>
    </div>
  );
}

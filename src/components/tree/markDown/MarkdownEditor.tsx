import React, { useState, useEffect } from "react";
import "./MarkdownEditor.css";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/markdown/markdown";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

interface MarkdownEditorProps {
  nodeKey?: string;
  data?: any;
  title?: string;
  setContent?: any;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const { data, title, setContent } = props;

  const [input, setInput] = useState(
    data || `# ${title}\n请输入正文\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`
  );

  useEffect(() => {
    setInput(
      data || `# ${title}\n请输入正文\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`
    );
  }, [data, title]);
  useEffect(() => {
    setContent(input)
    //eslint-disable-next-line
  }, [input]);
  return (
    <div className="markDownEditor">
      <div className="markDownEditorWrapper">
        {input && typeof input === "string" ? (
          <CodeMirror
            value={input}
            options={{
              mode: "markdown",
              theme: "material",
              lineNumbers: true,
              lineWrapping: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setInput(value);
            }}
          // onChange={(editor, metadata, value) => {}}
          />
        ) : null}
      </div>
      <div className="viewerWrapper" id="editor-preview">
        {input && typeof input === "string" ? (
          <ReactMarkdown
            source={input}
            // skipHtml={false}
            escapeHtml={false}
            renderers={{ code: CodeBlock }}
          />
        ) : null}
      </div>
    </div>
  );
};
MarkdownEditor.defaultProps = {};
export default MarkdownEditor;

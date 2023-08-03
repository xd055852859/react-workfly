import React from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownViewer from './MarkdownViewer';

interface CompanyPersonProps {
  targetData: any;
  editable: any;
  setContent:any
}

const Markdown: React.FC<CompanyPersonProps> = (props) => {
  const { targetData, setContent, editable } = props;

  return (
    <React.Fragment>
      {editable ? (
        <MarkdownEditor
          nodeKey={targetData._key}
          title={targetData ? targetData.title : '新标题'}
          data={targetData.content}
          setContent={setContent}
        />
      ) : (
        <MarkdownViewer
          data={
            targetData && targetData.content
              ? targetData.content
              : `# ${targetData ? targetData.title : '新标题'}\n请输入正文\n`
          }
        />
      )}
    </React.Fragment>
  );
};
Markdown.defaultProps = {};
export default Markdown;
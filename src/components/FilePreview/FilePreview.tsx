import React from 'react';

import './FilePreview.css';

interface FilePreviewProps {
  title: string;
  content: string;
  language?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ title, content, language = 'yaml' }) => {
  return (
    <div className="file-preview">
      <h3>{title}</h3>
      <pre><code className={`language-${language}`}>{content}</code></pre>
    </div>
  );
};

export default FilePreview;

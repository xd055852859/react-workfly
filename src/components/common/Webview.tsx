import React, { useState, useRef } from 'react';
import Loading from './loading';

interface Props {
  uri: string;
}

export default function Webview({ uri }: Props) {
  const [loading, setloading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleOnload() {
    setloading(false);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        name="frame-container"
        className="web-view"
        title={window.name}
        src={uri}
        frameBorder="0"
        width="100%"
        height="100%"
        onLoad={handleOnload}
      ></iframe>
      {loading ? <Loading /> : null}
    </div>
  );
}

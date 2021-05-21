import React, {useEffect } from 'react';
// import './userCenter.css';
import QRCode from 'qrcode';
interface CodeProps {
  url: string;
  id: string;
}

const Code: React.FC<CodeProps> = (props) => {
  const { url, id } = props;
  useEffect(() => {
    if (url) {
      QRCode.toCanvas(
        document.getElementById('canvas' + id),
        url,
        function (error) {
          if (error) console.error(error);
          console.log('success!');
        }
      );
    }
  }, [url,id]);
  return (
    <div>
      <canvas id={'canvas' + id}></canvas>
    </div>
  );
};
Code.defaultProps = {};
export default Code;

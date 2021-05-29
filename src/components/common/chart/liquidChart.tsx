import React, {useEffect,useRef } from 'react';
import { Liquid } from '@antv/g2plot';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface LiquidChartProps {
  percent: number;
  zoom: number;
  liquidId: string;
  fillColor: string;
}

const LiquidChart: React.FC<LiquidChartProps> = (props) => {
  const { percent, zoom, liquidId,fillColor } = props;
  let liquidRef = useRef<any>(null);
  useMount(() => {
    liquidRef.current = new Liquid(liquidId, {
      percent: percent,
      outline: {
        border: 2,
        distance: 7,
      },
      wave: {
        length: 128,
      },
      renderer: 'svg',
      liquidStyle: {
        fill: fillColor,
        stroke: '#fff',
      },
      statistic: {
        content: {
          style: {
            fontSize: '120px',
            height: '120px',
          },
          formatter: (item) => {
            return item?.percent * 100 + '%';
          },
        },
      },
    });
    liquidRef.current.render();
    return () => {
      liquidRef.current.destroy();
    };
  });
  useEffect(() => {
    if (liquidRef.current) {
      liquidRef.current.update({
        percent: percent,
      });
    }
  }, [percent]);
  return <div id={liquidId} style={{ zoom: zoom }}></div>;
};
LiquidChart.defaultProps = {};
export default LiquidChart;

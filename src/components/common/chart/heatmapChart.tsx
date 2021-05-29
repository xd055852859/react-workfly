import React, { useState, useEffect,useRef } from 'react';
import { Heatmap } from '@antv/g2plot';
// import './userCenter.css';
interface HeatmapChartProps {
  data: any;
  // chartHeight:number
  height: number;
  width: number;
  heatmapId: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = (props) => {
  const { data, height, width, heatmapId } = props;
  let heatmapRef = useRef<any>(null);
  useEffect(() => {
    heatmapRef.current = new Heatmap(heatmapId, {
      // appendPadding: 10,
      height: height,
      width: width,
      data,
      xField: 'weekDay',
      yField: 'weekDate',
      // yAxis: false,
      autoFit: false,
      colorField: 'value',
      color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
      meta: {
        'weekDay': {
          type: 'cat',
        },
      },
      // state: {
      //   active: {
      //     style: {
      //       lineWidth: 0,
      //       fillOpacity: 0.65,
      //     },
      //   },
      // },
      // interactions: [
      //   { type: 'element-single-selected' },
      //   { type: 'element-active' },
      // ],
    });
    heatmapRef.current.render();
    return () => {
      heatmapRef.current.destroy();
    };
  }, []);
  useEffect(() => {
    if (heatmapRef.current) {
      heatmapRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={heatmapId}></div>;
};
HeatmapChart.defaultProps = {};
export default HeatmapChart;

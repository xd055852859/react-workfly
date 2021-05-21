import React, {useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface LineChartProps {
  data: any;
  chartHeight: number;
  lineId: string;
  zoom?: number;
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { data, chartHeight, lineId, zoom } = props;
  let lineRef = useRef<any>(null);
  useMount(() => {
    lineRef.current = new Line(lineId, {
      data,
      height: chartHeight,
      xField: 'name',
      yField: 'value',
      xAxis: false,
      yAxis: false,
      // seriesField: 'value',
      // xAxis: {
      //   label: { offset: -10 },
      // },
      // autoFit: true,
      padding: 'auto',
      renderer: 'svg',
      smooth: true,
      // yAxis: {
      //   label: {
      //     // 数值格式化为千分位
      //     formatter: (v) => v
      //   },
      // },
      // animation: {
      //   appear: {
      //     animation: 'path-in',
      //     duration: 5000,
      //   },
      // },
    });
    lineRef.current.render();
    return () => {
      lineRef.current.destroy();
    };
  });
  useEffect(() => {
    if (lineRef.current) {
      console.log(data);
      lineRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={lineId} style={{ zoom: zoom }}></div>;
};
LineChart.defaultProps = { zoom: 1 };
export default LineChart;

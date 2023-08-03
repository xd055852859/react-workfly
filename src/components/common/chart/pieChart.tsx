import React, { useEffect, useRef } from 'react';
import { Pie } from '@antv/g2plot';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface PieChartProps {
  data: any;
  // chartHeight:number
  height: number;
  width: number;
  pieId: string;
  fontColor: string
}

const PieChart: React.FC<PieChartProps> = (props) => {
  const { data, height, width, pieId, fontColor } = props;
  let pieRef = useRef<any>(null);
  useMount(() => {
    pieRef.current = new Pie(pieId, {
      appendPadding: 10,
      height: height,
      width: width,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      // renderer: 'svg',
      pieStyle: { stroke: '#fff' },
      // label: false,
      label: {
        type: 'outer',
        content: '{name} {percentage}',
        style: {
          fill: fontColor,
        },
      },
      state: {
        active: {
          style: {
            lineWidth: 0,
            fillOpacity: 0.65,
          },
        },
      },
      interactions: [
        { type: 'element-single-selected' },
        { type: 'element-active' },
      ],
      xAxis: {
        // 格式化 y 轴标签加单位，自定义 labal 样式
        label: {
          style: {
            fill: fontColor,
          },
        },
      },
      yAxis: {
        // 格式化 y 轴标签加单位，自定义 labal 样式
        label: {
          style: {
            fill: fontColor,
          },
        },
      },
      legend: false
    });
    pieRef.current.render();
    return () => {
      pieRef.current.destroy();
    };
  });
  useEffect(() => {
    if (pieRef.current) {
      pieRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={pieId}></div>;
};
PieChart.defaultProps = {};
export default PieChart;

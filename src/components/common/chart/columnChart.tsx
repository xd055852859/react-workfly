import React, { useEffect, useRef } from "react";
import { Column } from "@antv/g2plot";
import { useMount } from "../../../hook/common";
// import './userCenter.css';
interface ColumnChartProps {
  data: any;
  // chartHeight:number
  height: number;
  width: number;
  columnId: string;
}

const ColumnChart: React.FC<ColumnChartProps> = (props) => {
  const { data, height, width, columnId } = props;
  let columnRef = useRef<any>(null);
  useMount(() => {
    columnRef.current = new Column(columnId, {
      data,
      height: height,
      width: width,
      isGroup: true,
      xField: "name",
      yField: "number",
      seriesField: "type",
      /** 设置颜色 */
      //color: ['#1ca9e6', '#f88c24'],
      /** 设置间距 */
      // marginRatio: 0.1,
      label: {
        // 可手动配置 label 数据标签位置
        position: "middle", // 'top', 'middle', 'bottom'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          { type: "interval-adjust-position" },
          // 数据标签防遮挡
          { type: "interval-hide-overlap" },
          // 数据标签文颜色自动调整
          { type: "adjust-color" },
        ],
      },
      state: {
        active: {
          style: {
            lineWidth: 0,
            fillOpacity: 0.65
          },
        },
      },
      interactions: [
        { type: "element-single-selected" },
        { type: "element-active" },
      ],
      // animation: {
      //   appear: {
      //     animation: 'zoom-in',
      //     duration: 5000,
      //   },
      // },
    });
    columnRef.current.render();
    return () => {
      columnRef.current.destroy();
    };
  });
  useEffect(() => {
    if (columnRef.current) {
      columnRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={columnId}></div>;
};
ColumnChart.defaultProps = {};
export default ColumnChart;

import { Treemap } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface HeatmapChartProps {
  data: any;
  treemapId: string;
  width: number;
  height: number;
  zoom?: number
}

const HeatmapChart: React.FC<HeatmapChartProps> = (props) => {
  const { data, treemapId, width, height, zoom } = props;
  let treemapRef = useRef<any>(null);
  useMount(() => {
    treemapRef.current = new Treemap(treemapId, {
      data: data,
      colorField: 'name',
      width: width,
      height: height,
      xAxis: {
        // 格式化 y 轴标签加单位，自定义 labal 样式
        label: {
          style: {
            fill: '#fff',
          },
        },
      },
      yAxis: {
        // 格式化 y 轴标签加单位，自定义 labal 样式
        label: {
          style: {
            fill: '#fff',
          },
        },
      },
      legend: {
        // 格式化 y 轴标签加单位，自定义 labal 样式
        itemName: {
          style: {
            fill: '#fff',
          },
        },
        pageNavigator: {
          text: {
            style: {
              fill: '#fff',
            }
          },
          marker: {
            style: {
              fill: '#fff',
            }
          },
        }
      },
    });
    treemapRef.current.render();
  });
  useEffect(() => {
    if (treemapRef.current) {
      treemapRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={treemapId} style={{ zoom: zoom }}></div>;
};
HeatmapChart.defaultProps = {};
export default HeatmapChart;

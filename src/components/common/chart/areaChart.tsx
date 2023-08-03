import { Area } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface AreaChartProps {
  data: any;
  areaId: string;
  width: number;
  height: number;
  zoom?: number
}

const AreaChart: React.FC<AreaChartProps> = (props) => {
  const { data, areaId, width, height, zoom } = props;
  let areaRef = useRef<any>(null);
  useMount(() => {
    areaRef.current = new Area(areaId, {
      data,
      xField: 'date',
      yField: 'value',
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
      // 添加label
      // label: {
      //   style: {
      //     fill: '#fff',
      //   }
      // },
      width: width,
      height: height,
      seriesField: 'groupName',
    });
    areaRef.current.render();
  });
  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={areaId} style={{ zoom: zoom }}></div>;
};
AreaChart.defaultProps = {};
export default AreaChart;

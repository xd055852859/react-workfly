import React, { useRef, useEffect } from "react";
import { Gauge } from "@antv/g2plot";
import { useMount } from "../../../hook/common";
// import './userCenter.css';
interface GaugeChartProps {
  percent: any;
  // chartHeight:number
  height?: number;
  width?: number;
  gaugeId: string;
  zoom: number
}

const GaugeChart: React.FC<GaugeChartProps> = (props) => {
  const { percent, gaugeId, zoom } = props;

  let gaugeRef = useRef<any>(null);
  useMount(() => {
    gaugeRef.current = new Gauge(gaugeId, {
      percent: percent,
      // range: {
      //   ticks: [0, 1 / 3, 2 / 3, 1],
      //   color: ['#F4664A', '#FAAD14', '#30BF78'],
      // },
      range: {
        color: '#1890ff',
      },
      indicator: {
        pointer: {
          style: {
            stroke: '#D0D0D0',
          },
        },
        pin: {
          style: {
            stroke: '#D0D0D0',
          },
        },
      },
      axis: {
        label: {
          formatter(v) {
            return Number(v) * 100;
          },
        },
        subTickLine: {
          count: 3,
        },
      },
      statistic: {
        content: {
          //eslint-disable-next-line
          formatter: (item) => {
            return '超越队友：' + parseInt(item?.percent * 100 + '') + '%';
          },
          style: {
            color: 'rgba(0,0,0,0.65)',
            fontSize: '30px',
          },
        },
      },
    });
    gaugeRef.current.render();
    // plot.on('plot:click', (...args) => {
    // });
    return () => {
      gaugeRef.current.destroy();
    };
  });
  useEffect(() => {
    if (gaugeRef.current) {
      gaugeRef.current.update({
        percent: percent,
      });
    }
  }, [percent]);
  return <div id={gaugeId} style={{ zoom: zoom }}></div>;
};
GaugeChart.defaultProps = {};
export default GaugeChart;

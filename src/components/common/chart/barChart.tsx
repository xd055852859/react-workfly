import { Bar } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface BarChartProps {
    data: any;
    barId: string;
    width: number;
    height: number;
    zoom?: number;onClick:Function
}

const BarChart: React.FC<BarChartProps> = (props) => {
    const { data, barId, width, height, zoom,onClick } = props;
    let barRef = useRef<any>(null);
    useMount(() => {
        barRef.current = new Bar(barId, {
            data,
            xField: 'value',
            yField: 'nickName',
            // seriesField: 'nickName',
            width: width,
            height: height,
            legend: false,
            tooltip: {
                formatter: (datum) => {
                    return { name: '活力值', value: datum.value };
                },
            },
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

        });
        barRef.current.render();
        barRef.current.on('element:click', (...args) => {       
            onClick(...args)        
        });
    });
    useEffect(() => {
        if (barRef.current) {
            barRef.current.update({
                data: data,
            });
        }
    }, [data]);
    return <div id={barId} style={{ zoom: zoom }}></div>;
};
BarChart.defaultProps = {};
export default BarChart;

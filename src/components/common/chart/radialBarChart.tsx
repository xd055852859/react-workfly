import { RadialBar } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface RadialBarChartProps {
    data: any;
    radialBarId: string;
    width: number;
    height: number;
    zoom?: number
}

const RadialBarChart: React.FC<RadialBarChartProps> = (props) => {
    const { data, radialBarId, width, height, zoom } = props;
    let roseRef = useRef<any>(null);
    useMount(() => {
        roseRef.current = new RadialBar(radialBarId, {
            data,
            xField: 'nickName',
            yField: 'value',
            width: width,
            height: height,
            // maxAngle: 90, //最大旋转角度,
            radius: 0.8,
            innerRadius: 0.2,
            tooltip: {
                formatter: (datum) => {
                    return { name: '活力值', value: datum.value };
                },
            },
            colorField: 'value',
            color: ({ value }) => {
                if (value > 20) {
                    return '#36c361';
                } else if (value > 10) {
                    return '#2194ff';
                }
                return '#ff4d4f';
            },
        });
        roseRef.current.render();
    });
    useEffect(() => {
        if (roseRef.current) {
            roseRef.current.update({
                data: data,
            });
        }
    }, [data]);
    return <div id={radialBarId} style={{ zoom: zoom }}></div>;
};
RadialBarChart.defaultProps = {};
export default RadialBarChart;

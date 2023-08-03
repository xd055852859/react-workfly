import { DualAxes } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import { useMount } from '../../../hook/common';

import './dualAxesChart.css';
interface DualAxesChartProps {
    data: any;
    dualAxesId: string;
    width: number;
    height: number;
    zoom?: number
}
const DualAxesChart: React.FC<DualAxesChartProps> = (props) => {
    const { data, dualAxesId, width, height, zoom } = props;
    let dualAxesRef = useRef<any>(null);
    useMount(() => {
        dualAxesRef.current = new DualAxes(dualAxesId, {
            data: [data, data],
            xField: 'time',
            yField: ['value', 'count'],
            width: width,
            height: height,
            tooltip: {
                customContent: (title, data) => {
                    return `<div class="dualAxesChart-box">
                    <div>时间：${title}</div>
                    ${data[0]?.data?.groupName ? `<div>项目：${data[0]?.data?.groupName}</div>` : ''}
                    ${data[0]?.data?.cardTitle ? `<div>干系人：${data[0]?.data?.creatorName}
                    ${data[0]?.data?.creatorName && data[0]?.data?.executorName
                                ? "⇀"
                                : ""}
                      ${data[0]?.data?.executorName ? data[0]?.data?.executorName : ''}</div>` : ''}
                    <div>操作：${data[0]?.data?.log}</div>
                    ${data[0]?.data?.cardTitle ? `<div>任务：${data[0]?.data?.cardTitle}</div> ` : ''}
                    <div>活力：${data[0]?.value}</div>
                    <div>累计：${data[1]?.value}</div>
                    </div>`;
                }
            },
            geometryOptions: [
                {
                    geometry: 'column',
                },
                {
                    geometry: 'line',
                    lineStyle: {
                        lineWidth: 2,
                    },
                },
            ],
            xAxis: {
                // 格式化 y 轴标签加单位，自定义 labal 样式
                label: {
                    style: {
                        fill: '#fff',
                    },
                },
            },
            legend: false,
            yAxis: {
                // 格式化 y 轴标签加单位，自定义 labal 样式
                value: {
                    label: {
                        style: {
                            fill: '#fff',
                        },
                    }
                },
                count: {
                    label: {
                        style: {
                            fill: '#fff',
                        },
                    }
                },
            },

        });
        dualAxesRef.current.render();
    });
    useEffect(() => {
        if (dualAxesRef.current) {
            dualAxesRef.current.update({
                data: [data, data],
            });
        }
    }, [data]);
    return <div id={dualAxesId} style={{ zoom: zoom }}></div>;
};
DualAxesChart.defaultProps = {};
export default DualAxesChart;

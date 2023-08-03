import { Rose } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
import { useMount } from '../../../hook/common';
// import './userCenter.css';
interface RoseChartProps {
    data: any;
    roseId: string;
    width: number;
    height: number;
    zoom?: number
}

const RoseChart: React.FC<RoseChartProps> = (props) => {
    const { data, roseId, width, height, zoom } = props;
    let roseRef = useRef<any>(null);
    useMount(() => {
        roseRef.current = new Rose(roseId, {
            data,
            xField: 'groupName',
            yField: 'value',
            width: width,
            height: height,
            seriesField: 'groupName',
            radius: 0.9,
            label: {
                offset: -15,
            },
            // xAxis: {
            //     // 格式化 y 轴标签加单位，自定义 labal 样式
            //     label: {
            //         style: {
            //             fill: '#fff',
            //         },
            //     },
            // },
            // yAxis: {
            //     // 格式化 y 轴标签加单位，自定义 labal 样式
            //     label: {
            //         style: {
            //             fill: '#fff',
            //         },
            //     },
            // },
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
        roseRef.current.render();
    });
    useEffect(() => {
        if (roseRef.current) {
            roseRef.current.update({
                data: data,
            });
        }
    }, [data]);
    return <div id={roseId} style={{ zoom: zoom }}></div>;
};
RoseChart.defaultProps = {};
export default RoseChart;

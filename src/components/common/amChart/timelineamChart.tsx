import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";
import * as am4plugins_bullets from "@amcharts/amcharts4/plugins/bullets";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useMount } from '../../../hook/common';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
interface TimelineamChartProps {
    data: any;
    timelineId: string;
    onClick: Function,
    width?: number;
    height?: number;
    zoom?: number
}

const TimelineamChart: React.FC<TimelineamChartProps> = (props) => {
    const { data, timelineId, width, height, zoom, onClick } = props;
    let timelineRef = useRef<any>(null);
    useMount(() => {
        let timelineData: any = []
        timelineRef.current = am4core.create(timelineId, am4plugins_timeline.SerpentineChart);
        timelineRef.current.curveContainer.padding(30, 20, 0, 20);
        timelineRef.current.levelCount = 3;
        timelineRef.current.yAxisRadius = am4core.percent(20);
        timelineRef.current.yAxisInnerRadius = am4core.percent(2);
        timelineRef.current.maskBullets = false;
        let colorSet = new am4core.ColorSet();

        timelineRef.current.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
        timelineRef.current.dateFormatter.dateFormat = "HH";
        timelineData = data.map((item, index) => {
            item.color = colorSet.getIndex(item.logType * 3);
            return item
        })
        timelineRef.current.data = timelineData;

        // timelineRef.current.fontSize = 10;
        // timelineRef.current.tooltipContainer.fontSize = 10;

        let categoryAxis = timelineRef.current.yAxes.push(new am4charts.CategoryAxis());
        // categoryAxis.dataFields.category = "category";
        // categoryAxis.renderer.grid.template.disabled = true;
        // categoryAxis.renderer.labels.template.paddingRight = 25;
        // categoryAxis.renderer.minGridDistance = 10;
        // categoryAxis.renderer.labels.template.fill = am4core.color("#fff");

        let dateAxis = timelineRef.current.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.baseInterval = { count: 15, timeUnit: "minute" };
        dateAxis.renderer.tooltipLocation = 0;
        dateAxis.renderer.line.strokeDasharray = "1,2";
        dateAxis.renderer.line.strokeOpacity = 1;
        dateAxis.renderer.line.stroke = am4core.color("#fff");
        
        // dateAxis.title.stroke = "#fff";

        dateAxis.tooltip.background.fillOpacity = 1;
        dateAxis.tooltip.background.cornerRadius = 5;
        dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        dateAxis.tooltip.label.paddingTop = 7;
        dateAxis.tooltip.label.strokeOpacity = 1;
        dateAxis.fontSize = 14;
        dateAxis.endLocation = 0;
        dateAxis.startLocation = -0.5;
        // dateAxis.renderer.labels.template.strokeOpacity = 1;

        // dateAxis.renderer.labels.template.fill = am4core.color("#fff");
        //删掉空的时间单位
        // dateAxis.skipEmptyPeriods = true;

        let labelTemplate = dateAxis.renderer.labels.template;
        labelTemplate.verticalCenter = "middle";
        labelTemplate.fillOpacity = 1;
        // labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
        // labelTemplate.background.fillOpacity = 0;
        labelTemplate.strokeOpacity = 1;
        labelTemplate.padding(7, 7, 7, 7);
        // labelTemplate.stroke = am4core.color("#fff");
        // labelTemplate.strokeWidth = 0;
        labelTemplate.fill = am4core.color("#fff");

        let series = timelineRef.current.series.push(new am4plugins_timeline.CurveColumnSeries());
        series.columns.template.height = am4core.percent(15);

        series.dataFields.openDateX = "start";
        series.dataFields.dateX = "end";
        series.dataFields.categoryY = "category";
        series.baseAxis = categoryAxis;
        series.columns.template.propertyFields.fill = "color"; // get color from data
        series.columns.template.propertyFields.stroke = "color";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.fill = am4core.color("#fff");
        series.columns.template.fillOpacity = 1;
        // series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";


        let imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
        imageBullet1.locationX = 1;
        imageBullet1.propertyFields.stroke = "color";
        imageBullet1.background.propertyFields.fill = "color";
        imageBullet1.image = new am4core.Image();
        imageBullet1.image.propertyFields.href = "icon";
        imageBullet1.image.scale = 0.5;
        imageBullet1.circle.radius = am4core.percent(100);
        imageBullet1.dy = -5;
        imageBullet1.events.on("hit", function (ev) {
            onClick(ev.target.dataItem.dataContext.logIndex)
        }, this);

        let textBullet = series.bullets.push(new am4charts.LabelBullet());
        textBullet.label.propertyFields.text = "text";
        textBullet.disabled = true;
        textBullet.propertyFields.disabled = "textDisabled";
        textBullet.label.strokeOpacity = 0;
        textBullet.locationX = 1;
        textBullet.dy = - 100;
        textBullet.label.textAlign = "middle";

        // timelineRef.current.scrollbarX = new am4core.Scrollbar();
        // timelineRef.current.scrollbarX.align = "center"
        // timelineRef.current.scrollbarX.width = am4core.percent(75);
        // timelineRef.current.scrollbarX.opacity = 0.5;

        // let cursor = new am4plugins_timeline.CurveCursor();
        // timelineRef.current.cursor = cursor;
        // cursor.xAxis = dateAxis;
        // cursor.yAxis = categoryAxis;
        // cursor.lineY.disabled = true;
        // cursor.lineX.strokeDasharray = "1,4";
        // cursor.lineX.strokeOpacity = 1;

        // dateAxis.renderer.tooltipLocation2 = 0;
        // categoryAxis.cursorTooltipEnabled = false;

        let axisTooltip = categoryAxis.tooltip;
        axisTooltip.background.fill = am4core.color("#07BEB8");
        axisTooltip.background.strokeWidth = 0;
        axisTooltip.background.cornerRadius = 3;
        axisTooltip.background.pointerLength = 0;
        axisTooltip.dy = 5;

        // let label = timelineRef.current.createChild(am4core.Label);
        // label.text = "Another unlucky day in the office."
        // label.isMeasured = false;
        // label.y = am4core.percent(40);
        // label.x = am4core.percent(50);
        // label.horizontalCenter = "middle";
        // label.fontSize = 20;
        timelineRef.current.events.on("inited", function () {
            setTimeout(function () {
                hoverItem(series.dataItems.getIndex(0));
            }, 2000)
        })
        function hoverItem(dataItem) {
            // if (dataItem) {
                let previousBullet: any = null
                let bullet = dataItem.bullets.getKey(imageBullet1.uid);
                let index = dataItem.index;
                if (index >= series.dataItems.length - 1) {
                    index = -1;
                }
                if (bullet) {
                    if (previousBullet) {
                        previousBullet.isHover = false;
                    }
                    bullet.isHover = true;

                    previousBullet = bullet;
                }
            // }
        }
    })
    useEffect(() => {
        if (timelineRef.current) {
            let timelineData: any = []
            let colorSet = new am4core.ColorSet();
            timelineData = data.map((item, index) => {
                item.color = colorSet.getIndex(item.logType * 3);
                return item
            })
            timelineRef.current.data = timelineData;
        }
    }, [data]);
    return <div id={timelineId} style={{ zoom: zoom, width: width, height: height }}></div>;
}
TimelineamChart.defaultProps = {};
export default TimelineamChart;
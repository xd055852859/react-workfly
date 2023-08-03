import React, { useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline";
import * as am4plugins_bullets from "@amcharts/amcharts4/plugins/bullets";
import moment from "moment";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end
interface TimelineChartProps {
  data: any;
  timelineId: string;
  width?: number;
  height?: number;
  zoom?: number;
  timeLineStyle?: any;
  chartDate?: any;
}

const TimelineChart: React.FC<TimelineChartProps> = (props) => {
  const { data, timelineId, width, height, zoom, timeLineStyle,chartDate } = props;

  let timelineRef = useRef<any>(null);
  useEffect(() => {
    if (data) {
      console.log(data);
      let timelineData: any = [];
      timelineRef.current = am4core.create(
        timelineId,
        am4plugins_timeline.CurveChart
      );
      timelineRef.current.curveContainer.padding(20, 20, 20, 20);
      timelineRef.current.maskBullets = false;
      // timelineRef.current.tooltip.getFillFromObject = false;
      // timelineRef.current.tooltip.background.fill = am4core.color("#67b7dc");
      // timelineRef.current.tooltip.label.fill = am4core.color("#fff");

      let colorSet = new am4core.ColorSet();

      timelineRef.current.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";
      timelineRef.current.dateFormatter.dateFormat = "HH";
      timelineData = data.map((item, index) => {
        if (item.category === "bug") {
          item.color = colorSet.getIndex(222);
        } else {
          item.color = colorSet.getIndex(item.logType * 3);
        }

        return item;
      });
      timelineRef.current.data = timelineData;

      timelineRef.current.fontSize = 14;
      timelineRef.current.tooltipContainer.fontSize = 14;
      let categoryAxis = timelineRef.current.yAxes.push(
        new am4charts.CategoryAxis()
      );
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.labels.template.paddingRight = 25;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.innerRadius = 10;
      categoryAxis.renderer.radius = 30;

      let dateAxis = timelineRef.current.xAxes.push(new am4charts.DateAxis());

      dateAxis.renderer.points = getPoints();

      dateAxis.renderer.autoScale = false;
      dateAxis.renderer.autoCenter = false;
      dateAxis.renderer.minGridDistance = 70;
      dateAxis.baseInterval = { count: 0.5, timeUnit: "minute" };
      dateAxis.renderer.tooltipLocation = 0;
      dateAxis.renderer.line.strokeDasharray = "1,4";
      dateAxis.renderer.line.strokeOpacity = 1;
      // dateAxis.tooltip.background.fillOpacity = 0.2;
      // dateAxis.tooltip.background.cornerRadius = 5;
      // dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
      // dateAxis.tooltip.label.paddingTop = 7;
      // dateAxis.endLocation = 0;
      // dateAxis.startLocation = -0.5;

      dateAxis.min = moment(chartDate).hours(4).startOf("hours").valueOf();
      dateAxis.max = moment(chartDate).hours(18).endOf("hours").valueOf();
      // dateAxis.min = new Date(2019, 0, 9, 23, 55).getTime();
      // dateAxis.max = new Date(2019, 0, 11, 7, 10).getTime();

      dateAxis.renderer.line.stroke = am4core.color("#fff");
      //删掉空的时间单位
      // dateAxis.skipEmptyPeriods = true;

      let labelTemplate = dateAxis.renderer.labels.template;
      labelTemplate.verticalCenter = "middle";
      labelTemplate.fillOpacity = 0.6;
      // labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
      // labelTemplate.background.fillOpacity = 1;
      // labelTemplate.fill = new am4core.InterfaceColorSet().getFor("text");
      labelTemplate.fill = am4core.color("#fff");
      labelTemplate.padding(7, 7, 7, 7);

      let series = timelineRef.current.series.push(
        new am4plugins_timeline.CurveColumnSeries()
      );
      series.columns.template.height = am4core.percent(30);
      series.dataFields.openDateX = "start";
      series.dataFields.dateX = "end";
      series.dataFields.categoryY = "category";
      series.baseAxis = categoryAxis;
      series.columns.template.propertyFields.fill = "color"; // get color from data
      series.columns.template.propertyFields.stroke = "color";
      series.columns.template.strokeOpacity = 0;
      series.columns.template.fillOpacity = 0.6;

      series.tooltip.getFillFromObject = false;
      series.tooltip.label.propertyFields.fill = am4core.color("#fff");
      // series.tooltip.background.fill = 'color';
      series.columns.template.fill = am4core.color("#fff");
      // series.tooltip.label.fill = am4core.color("#fff");

      let imageBullet1 = series.bullets.push(
        new am4plugins_bullets.PinBullet()
      );
      imageBullet1.background.radius = 20;
      imageBullet1.locationX = 1;
      imageBullet1.propertyFields.stroke = "color";
      imageBullet1.background.propertyFields.fill = "color";
      imageBullet1.image = new am4core.Image();
      imageBullet1.image.propertyFields.href = "icon";
      imageBullet1.image.scale = 0.7;
      imageBullet1.circle.radius = am4core.percent(100);
      imageBullet1.background.fillOpacity = 0.8;
      imageBullet1.background.strokeOpacity = 0;
      imageBullet1.dy = -2;
      imageBullet1.background.pointerBaseWidth = 10;
      imageBullet1.background.pointerLength = 10;
      imageBullet1.tooltipHTML = `<div class='tooltip-div'>
            <div class='tooltip-item'><div class='tooltip-left'>项目:</div><div class='tooltip-right'>{groupName}</div></div>
            <div class='tooltip-item'><div class='tooltip-left'>干系人:</div><div class='tooltip-right'>{personName}</div></div>
            <div class='tooltip-item'><div class='tooltip-left'>操作:</div><div class='tooltip-right'>{text}</div></div>
            <div class='tooltip-item'><div class='tooltip-left'>任务:</div><div class='tooltip-right'>{cardTitle}</div></div>
            <div class='tooltip-item'><div class='tooltip-left'>活力:</div><div class='tooltip-right'>{energyValue}</div></div>
        </div>`;
      // imageBullet1.background.fill = am4core.color("#000");
      //   imageBullet1.tooltip.fill = am4core.color("#67b7dc");
      series.tooltip.pointerOrientation = "up";

      imageBullet1.background.adapter.add("pointerAngle", (value, target) => {
        if (target.dataItem) {
          let position = dateAxis.valueToPosition(
            target.dataItem.openDateX.getTime()
          );
          return dateAxis.renderer.positionToAngle(position);
        }
        return value;
      });

      let hs = imageBullet1.states.create("hover");
      hs.properties.scale = 1.3;
      hs.properties.opacity = 1;

      let textBullet = series.bullets.push(new am4charts.LabelBullet());
      textBullet.label.propertyFields.text = "text";
      textBullet.disabled = true;
      textBullet.propertyFields.disabled = "textDisabled";
      textBullet.label.strokeOpacity = 0;
      textBullet.locationX = 1;
      textBullet.dy = -100;
      textBullet.label.textAlign = "middle";

      timelineRef.current.scrollbarX = new am4core.Scrollbar();
      timelineRef.current.scrollbarX.align = "center";
      timelineRef.current.scrollbarX.width = am4core.percent(45);
      timelineRef.current.scrollbarX.parent =
        timelineRef.current.curveContainer;
      timelineRef.current.scrollbarX.height = 300;
      timelineRef.current.scrollbarX.orientation = "vertical";
      timelineRef.current.scrollbarX.x = 128;
      timelineRef.current.scrollbarX.y = -140;
      timelineRef.current.scrollbarX.isMeasured = false;
      timelineRef.current.scrollbarX.opacity = 0.5;

      let cursor = new am4plugins_timeline.CurveCursor();
      timelineRef.current.cursor = cursor;
      cursor.xAxis = dateAxis;
      cursor.yAxis = categoryAxis;
      cursor.lineY.disabled = true;
      cursor.lineX.disabled = true;

      dateAxis.renderer.tooltipLocation2 = 0;
      categoryAxis.cursorTooltipEnabled = false;

      timelineRef.current.zoomOutButton.disabled = true;

      // customizeGrip(timelineRef.current.scrollbarX.startGrip);
      // customizeGrip(timelineRef.current.scrollbarX.endGrip);

      let previousBullet;

      timelineRef.current.events.on("inited", function () {
        setTimeout(function () {
          hoverItem(series.dataItems.getIndex(0));
        }, 5000);
      });

      const hoverItem = (dataItem) => {
        if (dataItem) {
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
          setTimeout(function () {
            hoverItem(series.dataItems.getIndex(index + 1));
          }, 5000);
        }
      };
    }
    //eslint-disable-next-line
  }, [data]);
  const getPoints = () => {
    let points = [
      { x: -1300, y: 200 },
      { x: 0, y: 200 },
    ];

    let w = 400;
    let h = 400;
    let levelCount = 4;

    let radius = am4core.math.min(w / (levelCount - 1) / 2, h / 2);
    let startX = radius;

    for (let i = 0; i < 25; i++) {
      let angle = 0 + (i / 25) * 90;
      let centerPoint = { y: 200 - radius, x: 0 };
      points.push({
        y: centerPoint.y + radius * am4core.math.cos(angle),
        x: centerPoint.x + radius * am4core.math.sin(angle),
      });
    }

    for (let i = 0; i < levelCount; i++) {
      if (i % 2 !== 0) {
        points.push({
          y: -h / 2 + radius,
          x: startX + (w / (levelCount - 1)) * i,
        });
        points.push({
          y: h / 2 - radius,
          x: startX + (w / (levelCount - 1)) * i,
        });

        let centerPoint = {
          y: h / 2 - radius,
          x: startX + (w / (levelCount - 1)) * (i + 0.5),
        };
        if (i < levelCount - 1) {
          for (let k = 0; k < 50; k++) {
            let angle = -90 + (k / 50) * 180;
            points.push({
              y: centerPoint.y + radius * am4core.math.cos(angle),
              x: centerPoint.x + radius * am4core.math.sin(angle),
            });
          }
        }

        if (i === levelCount - 1) {
          points.pop();
          points.push({ y: -radius, x: startX + (w / (levelCount - 1)) * i });
          let centerPoint = {
            y: -radius,
            x: startX + (w / (levelCount - 1)) * (i + 0.5),
          };
          for (var k = 0; k < 25; k++) {
            let angle = -90 + (k / 25) * 90;
            points.push({
              y: centerPoint.y + radius * am4core.math.cos(angle),
              x: centerPoint.x + radius * am4core.math.sin(angle),
            });
          }
          points.push({ y: 0, x: 1300 });
        }
      } else {
        points.push({
          y: h / 2 - radius,
          x: startX + (w / (levelCount - 1)) * i,
        });
        points.push({
          y: -h / 2 + radius,
          x: startX + (w / (levelCount - 1)) * i,
        });
        let centerPoint = {
          y: -h / 2 + radius,
          x: startX + (w / (levelCount - 1)) * (i + 0.5),
        };
        if (i < levelCount - 1) {
          for (let k = 0; k < 50; k++) {
            let angle = -90 - (k / 50) * 180;
            points.push({
              y: centerPoint.y + radius * am4core.math.cos(angle),
              x: centerPoint.x + radius * am4core.math.sin(angle),
            });
          }
        }
      }
    }
    return points;
  };
  // useEffect(() => {
  //     if (timelineRef.current) {
  //         let timelineData: any = []
  //         let colorSet = new am4core.ColorSet();
  //         timelineData = data.map((item, index) => {
  //             item.color = colorSet.getIndex(item.logType * 3);
  //             return item
  //         })
  //         timelineRef.current.data = timelineData;
  //         let series = timelineRef.current.series.push(new am4plugins_timeline.CurveColumnSeries());
  //         setTimeout(
  //             function () {
  //                 hoverItem(series.dataItems.getIndex(0))
  //             }, 1000);
  //     }
  // }, [data]);
  return (
    <div
      id={timelineId}
      style={{ zoom: zoom, width: width, height: height, ...timeLineStyle }}
    ></div>
  );
};
TimelineChart.defaultProps = {};
export default TimelineChart;

/* Imports */
import React, { useEffect, useRef } from "react";
import { useMount } from "../../../hook/common";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

/**
 * Chart design taken from Samsung health app
 */
interface XYamChartProps {
  data: any;
  XYId: string;
  width?: number;
  height?: number;
  zoom?: number;
  onClick: Function;
}

const XYamChart: React.FC<XYamChartProps> = (props) => {
  const { data, XYId, width, height, zoom, onClick } = props;
  let XYRef = useRef<any>(null);
  useEffect(() => {
    if (data) {
      XYRef.current = am4core.create(XYId, am4charts.XYChart);
      XYRef.current.hiddenState.properties.opacity = 0;
      // this creates initial fade-in
      XYRef.current.paddingBottom = 30;
      XYRef.current.data = data;

      let categoryAxis = XYRef.current.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dx = 20;
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.labels.template.dy = 35;
      categoryAxis.renderer.tooltip.dy = 35;
      // categoryAxis.renderer.tooltipText = "{nickName}"
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      // categoryAxis.events.on("hit", function (ev) {
      //     // onClick(ev.target.dataItem.dataContext.userKey);
      // }, this);

      let valueAxis = XYRef.current.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      // valueAxis.renderer.labels.template.fillOpacity = 0.3;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.baseGrid.strokeOpacity = 0;
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      //eslint-disable-next-line
      let series = XYRef.current.series.push(new am4charts.ColumnSeries());
      series.dx = 20;
      series.dataFields.valueY = "steps";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value}";
      series.tooltip.getFillFromObject = false;
      series.tooltip.label.propertyFields.fill = am4core.color("#fff");
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.dy = -6;

      series.columnsContainer.zIndex = 100;
      series.columns.template.events.on(
        "hit",
        function (ev) {
          onClick(
            ev.target.dataItem.dataContext.userKey,
            ev.target.dataItem.dataContext.nickName,
            ev.target.dataItem.dataContext.href
          );
        },
        this
      );

      let columnTemplate = series.columns.template;
      columnTemplate.width = am4core.percent(20);
      columnTemplate.maxWidth = 33;
      columnTemplate.column.cornerRadius(60, 60, 10, 10);
      columnTemplate.strokeOpacity = 0;
      columnTemplate.fill = am4core.color("#fff");

      series.heatRules.push({
        target: columnTemplate,
        property: "fill",
        dataField: "valueY",
        min: am4core.color("#e5dc36"),
        max: am4core.color("#5faa46"),
      });
      series.mainContainer.mask = undefined;

      let cursor = new am4charts.XYCursor();
      XYRef.current.cursor = cursor;
      cursor.lineX.disabled = true;
      cursor.lineY.disabled = true;
      cursor.behavior = "none";

      let bullet = columnTemplate.createChild(am4charts.CircleBullet);
      bullet.circle.radius = 15;
      bullet.valign = "bottom";
      bullet.align = "center";
      bullet.isMeasured = true;
      bullet.mouseEnabled = false;
      bullet.verticalCenter = "bottom";
      bullet.interactionsEnabled = false;
      let hoverState = bullet.states.create("hover");
      hoverState.interactionsEnabled = false;
      let outlineCircle = bullet.createChild(am4core.Circle);
      outlineCircle.adapter.add("radius", function (radius, target) {
        let circleBullet = target.parent;
        return circleBullet.circle.pixelRadius + 5;
      });
      let image = bullet.createChild(am4core.Image);
      image.width = 40;
      image.height = 40;
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
      image.propertyFields.href = "href";
      image.adapter.add("mask", function (mask, target) {
        var circleBullet = target.parent;
        return circleBullet.circle;
      });

      image.events.on(
        "hit",
        function (ev) {
          onClick(
            ev.target.dataItem.dataContext.userKey,
            ev.target.dataItem.dataContext.name,
            ev.target.dataItem.dataContext.href
          );
        },
        this
      );

      let previousBullet;
      XYRef.current.cursor.events.on("cursorpositionchanged", function (event) {
        let dataItem = series.tooltipDataItem;
        if (dataItem.column) {
          let bullet = dataItem.column.children.getIndex(1);
          if (previousBullet && previousBullet !== bullet) {
            previousBullet.isHover = false;
          }
          if (previousBullet !== bullet) {
            let hs = bullet.states.getKey("hover");
            if (hs) {
              hs.properties.dy = -bullet.parent.pixelHeight;
              bullet.isHover = true;
              previousBullet = bullet;
            }
          }
        }
      });
    }
  }, [data]);

  // chart.data = [{
  //     "name": "Monica",
  //     "steps": 45688,
  //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg"
  // }, {
  //     "name": "Joey",
  //     "steps": 35781,
  //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/joey.jpg"
  // }, {
  //     "name": "Ross",
  //     "steps": 25464,
  //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/ross.jpg"
  // }, {
  //     "name": "Phoebe",
  //     "steps": 18788,
  //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg"
  // }, {
  //     "name": "Rachel",
  //     "steps": 15465,
  //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/rachel.jpg"
  // }, {
  //     "name": "Chandler",
  //     "steps": 11561,
  //     "href": "https://www.amcharts.com/wp-content/uploads/2019/04/chandler.jpg"
  // }];

  return (
    <div id={XYId} style={{ zoom: zoom, width: width, height: height }}></div>
  );
};
XYamChart.defaultProps = {};
export default XYamChart;

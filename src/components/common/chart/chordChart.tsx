import React, { useRef, useEffect } from "react";
import { Chord } from "@antv/g2plot";
import { useMount } from "../../../hook/common";
// import './userCenter.css';
interface ChordChartProps {
  data: any;
  // chartHeight:number
  height: number;
  width: number;
  chordId: string;
}

const ChordChart: React.FC<ChordChartProps> = (props) => {
  const { data, height, width, chordId } = props;

  let chordRef = useRef<any>(null);
  useMount(() => {
    chordRef.current = new Chord(chordId, {
      height: height,
      width: width,
      data,
      sourceField: "from",
      targetField: "to",
      weightField: "value",
      state: {
        active: {
          style: {
            lineWidth: 0,
            fillOpacity: 0.65,
          },
        },
      },
    });
    chordRef.current.render();
    return () => {
      chordRef.current.destroy();
    };
  });
  useEffect(() => {
    if (chordRef.current) {
      chordRef.current.update({
        data: data,
      });
    }
  }, [data]);
  return <div id={chordId}></div>;
};
ChordChart.defaultProps = {};
export default ChordChart;

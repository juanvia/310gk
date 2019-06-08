import React from "react";
import { range } from "ramda";
export const ScatterPlot = ({ data, height }) => (
  <g>
    {data.map(([x, y], index) => (
      <circle key={index} cx={x} cy={height - y} r={2} fill="black" />
    ))}
  </g>
);

export const palette = [
  "rgba(255, 0, 0, 0.1)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.3)",
  "rgba(255, 0, 0, 0.4)",
  "rgba(255, 0, 0, 0.5)",
  "rgba(255, 0, 0, 0.6)",
  "rgba(255, 0, 0, 0.7)",
  "rgba(255, 0, 0, 0.8)",
  "rgba(255, 0, 0, 0.9)",
  "rgba(255, 0, 0, 1)"
];

export const buildPath = (height, data) =>
  `M0,${height} ` + data.map(([x, y]) => `L${x},${height - y}`).join(" ");

export const Path = ({ color, data, height }) => (
  <path d={buildPath(height, data)} stroke={color} fill="none" />
);

export const Paths = ({ pathsData, height }) =>
  pathsData.map((data, index) => (
    <Path key={index} height={height} data={data} color={palette[index]} />
  ));

export const Plot = ({ paths, points, size, onClick }) => (
  <svg width={size} height={size}>
    <Paths pathsData={paths} height={size} />
    {points && <ScatterPlot data={points} height={size} />}
  </svg>
);

export const getExamples = (rangeStart, rangeEnd, amount) =>
  range(0, amount).map(
    index => rangeStart + ((rangeEnd - rangeStart) / amount) * index
  );

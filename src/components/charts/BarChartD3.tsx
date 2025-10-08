"use client";

import * as d3 from "d3";
import * as React from "react";
import { ChartContainer } from "./ChartContainer";

export function BarChartD3({
  data,
  height = 240,
  valueLabel = "value",
  margin = { top: 10, right: 12, bottom: 28, left: 36 },
}: {
  data: { label: string; value: number }[];
  height?: number;
  valueLabel?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
}) {
  return (
    <ChartContainer height={height}>
      {(host, { width, height }) => {
        host.innerHTML = "";
        const svg = d3
          .select(host)
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        const innerW = Math.max(0, width - margin.left - margin.right);
        const innerH = Math.max(0, height - margin.top - margin.bottom);

        const g = svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.label))
          .range([0, innerW])
          .padding(0.2);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)!])
          .nice()
          .range([innerH, 0]);

        g.append("g")
          .attr("transform", `translate(0,${innerH})`)
          .call(d3.axisBottom(x).tickSizeOuter(0))
          .selectAll("text")
          .style("font-size", "10px");

        g.append("g")
          .call(d3.axisLeft(y).ticks(5))
          .selectAll("text")
          .style("font-size", "10px");

        g.selectAll("rect")
          .data(data)
          .join("rect")
          .attr("x", (d) => x(d.label)!)
          .attr("y", (d) => y(d.value))
          .attr("width", x.bandwidth())
          .attr("height", (d) => innerH - y(d.value))
          .attr("rx", 4)
          .attr("fill", "currentColor")
          .style("color", "hsl(var(--primary))");

        g.selectAll("text.barlabel")
          .data(data)
          .join("text")
          .attr("class", "barlabel")
          .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
          .attr("y", (d) => y(d.value) - 6)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .style("fill", "hsl(var(--foreground))")
          .text((d) => d3.format(".0f")(d.value));
      }}
    </ChartContainer>
  );
}

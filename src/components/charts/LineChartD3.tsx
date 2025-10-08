"use client";

import * as d3 from "d3";
import * as React from "react";
import { ChartContainer } from "./ChartContainer";

type Point = { x: string | number | Date; y: number };

export function LineChartD3({
  data,
  height = 240,
  margin = { top: 10, right: 12, bottom: 28, left: 36 },
}: {
  data: Point[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}) {
  return (
    <ChartContainer height={height}>
      {(host, { width, height }) => {
        host.innerHTML = "";

        // guard na pustą tablicę
        if (!data || data.length === 0) {
          const empty = document.createElement("div");
          empty.className = "text-sm text-muted-foreground p-4";
          empty.textContent = "No data";
          host.appendChild(empty);
          return;
        }

        const svg = d3.select(host).append("svg").attr("width", width).attr("height", height);
        const innerW = Math.max(0, width - margin.left - margin.right);
        const innerH = Math.max(0, height - margin.top - margin.bottom);
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const isDate = data[0]?.x instanceof Date;

        // Y: wspólny dla obu przypadków
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.y)!])
          .nice()
          .range([innerH, 0]);

        if (isDate) {
          // ===== Oś X: czasowa =====
          const dataTime = data as { x: Date; y: number }[];

          const xTime = d3
            .scaleTime()
            .domain(d3.extent(dataTime, (d) => d.x) as [Date, Date])
            .range([0, innerW]);

          // Osie
          g.append("g")
            .attr("transform", `translate(0,${innerH})`)
            .call(d3.axisBottom(xTime).ticks(6))
            .selectAll("text")
            .style("font-size", "10px");

          g.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "10px");

          // Linia
          const line = d3
            .line<{ x: Date; y: number }>()
            .x((d) => xTime(d.x))
            .y((d) => y(d.y))
            .curve(d3.curveMonotoneX);

          g.append("path")
            .datum(dataTime)
            .attr("fill", "none")
            .attr("stroke", "hsl(var(--primary))")
            .attr("stroke-width", 2)
            .attr("d", line);

          // Punkty
          g.selectAll("circle")
            .data(dataTime)
            .join("circle")
            .attr("cx", (d) => xTime(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", 3)
            .attr("fill", "hsl(var(--primary))");
        } else {
          // ===== Oś X: kategoryczna (point) =====
          const labels = data.map((d) => String(d.x));
          const xPoint = d3.scalePoint<string>().domain(labels).range([0, innerW]).padding(0.5);

          // Osie
          g.append("g")
            .attr("transform", `translate(0,${innerH})`)
            .call(d3.axisBottom(xPoint).tickSizeOuter(0))
            .selectAll("text")
            .style("font-size", "10px");

          g.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "10px");

          // Linia
          const line = d3
            .line<{ x: string | number; y: number }>()
            .x((d) => xPoint(String(d.x)) ?? 0)
            .y((d) => y(d.y))
            .curve(d3.curveMonotoneX);

          g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "hsl(var(--primary))")
            .attr("stroke-width", 2)
            .attr("d", line as any);

          // Punkty
          g.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => xPoint(String(d.x)) ?? 0)
            .attr("cy", (d) => y(d.y))
            .attr("r", 3)
            .attr("fill", "hsl(var(--primary))");
        }
      }}
    </ChartContainer>
  );
}

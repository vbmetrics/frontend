"use client";

import * as d3 from "d3";
import * as React from "react";
import { ChartContainer } from "./ChartContainer";

type Row = { label: string } & Record<string, number | string>;

// Unikalny symbol na etykietę – nie koliduje z Record<string, number>.
const LABEL = Symbol("label");

type StackInput = Record<string, number> & { [LABEL]: string };

export function StackedBarD3({
  data,
  keys,
  colors = ["#22c55e", "#84cc16", "#facc15", "#ef4444"],
  height = 240,
  margin = { top: 10, right: 12, bottom: 28, left: 36 },
}: {
  data: Row[];
  keys: string[];
  colors?: string[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}) {
  return (
    <ChartContainer height={height}>
      {(host, { width, height }) => {
        host.innerHTML = "";

        if (!data || data.length === 0) {
          const empty = document.createElement("div");
          empty.className = "text-sm text-muted-foreground p-4";
          empty.textContent = "No data";
          host.appendChild(empty);
          return;
        }

        // Przygotuj dane do d3.stack – numeric-only + symbol LABEL
        const stackInput: StackInput[] = data.map((d) => {
          const entry = { [LABEL]: String(d.label) } as StackInput;
          for (const k of keys) {
            entry[k] = Number((d as any)[k] ?? 0);
          }
          return entry;
        });

        const svg = d3.select(host).append("svg").attr("width", width).attr("height", height);
        const innerW = Math.max(0, width - margin.left - margin.right);
        const innerH = Math.max(0, height - margin.top - margin.bottom);
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
          .scaleBand()
          .domain(stackInput.map((d) => d[LABEL]))
          .range([0, innerW])
          .padding(0.2);

        const y = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(stackInput, (d) => keys.reduce((acc, k) => acc + (d[k] ?? 0), 0))!,
          ])
          .nice()
          .range([innerH, 0]);

        const color = d3.scaleOrdinal<string, string>().domain(keys).range(colors);

        const stacked = d3.stack<StackInput>().keys(keys)(stackInput);

        // Oś X
        g.append("g")
          .attr("transform", `translate(0,${innerH})`)
          .call(d3.axisBottom(x).tickSizeOuter(0))
          .selectAll("text")
          .style("font-size", "10px");

        // Oś Y
        g.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "10px");

        // Warstwy
        g.selectAll("g.layer")
          .data(stacked)
          .join("g")
          .attr("class", "layer")
          .attr("fill", (d) => color(d.key)!)
          .selectAll("rect")
          .data((d) => d)
          .join("rect")
          .attr("x", (d) => x(d.data[LABEL])!)
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())
          .attr("rx", 2);
      }}
    </ChartContainer>
  );
}

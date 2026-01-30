"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, PIE_COLORS } from "./chart-container";
import { formatCurrency } from "@/lib/utils";
import type { CategoryData } from "@/actions/analytics";

interface ExpenseCategoryChartProps {
  data: CategoryData[];
  loading?: boolean;
}

export function ExpenseCategoryChart({ data, loading = false }: ExpenseCategoryChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));

  const isEmpty = data.length === 0;

  return (
    <ChartContainer
      title="Expenses by Category"
      description="Distribution of expenses across categories"
      loading={loading}
      isEmpty={isEmpty}
      emptyMessage="No expense data for this period"
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="amount"
              nameKey="category"
              label={({ name, payload }) => `${name} (${(payload?.percentage ?? 0).toFixed(1)}%)`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="stroke-background stroke-2"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CategoryData & { fill: string };
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: data.fill }}
                        />
                        <span className="font-medium">{data.category}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <div>{formatCurrency(data.amount)}</div>
                        <div>{data.count} transaction(s)</div>
                        <div>{data.percentage.toFixed(1)}% of total</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value, entry) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from "@/lib/types";
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';
import { formatLargeNumber } from "@/lib/utils";

interface TotalValueAreaChartProps {
  products: Product[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Value
            </span>
            <span className="font-bold text-muted-foreground">
              {formatLargeNumber(payload[0].value)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-1 border-t mt-2">
          {format(new Date(label), "E, MMM d, yyyy")}
        </p>
      </div>
    );
  }

  return null;
};

export function TotalValueAreaChart({ products }: TotalValueAreaChartProps) {
  const now = new Date();
  const start = subDays(now, 29);
  const end = now;
  const days = eachDayOfInterval({ start, end });

  const data = days.map(day => {
    const productsOnDay = products.filter(p => isSameDay(new Date(p.createdAt), day));
    const totalValue = productsOnDay.reduce((sum, p) => sum + p.price, 0);
    return {
      date: day,
      value: totalValue,
    };
  });

  const ticks = days.map(day => day.getTime()).filter((_, i) => i % 3 === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Value (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33b45c" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#33b45c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              ticks={ticks} 
              tickFormatter={(date) => format(new Date(date), 'MMM d')} 
            />
            <YAxis tickFormatter={(value: number) => formatLargeNumber(value)} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="value" stroke="#33b45c" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

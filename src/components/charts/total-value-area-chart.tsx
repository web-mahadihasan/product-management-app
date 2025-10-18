"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from "@/lib/types";
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';
import { formatLargeNumber } from "@/lib/utils";

interface TotalValueAreaChartProps {
  products: Product[];
}

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
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              ticks={ticks} 
              tickFormatter={(date) => format(new Date(date), 'MMM d')} 
            />
            <YAxis tickFormatter={(value: number) => formatLargeNumber(value)} />
            <Tooltip formatter={(value: number) => formatLargeNumber(value)} />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
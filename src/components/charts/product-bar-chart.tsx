"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from "@/lib/types";
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';

interface ProductBarChartProps {
  products: Product[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Products
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
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

export function ProductBarChart({ products }: ProductBarChartProps) {
  const now = new Date();
  const start = subDays(now, 29);
  const end = now;
  const days = eachDayOfInterval({ start, end });

  const data = days.map(day => {
    const productsOnDay = products.filter(p => isSameDay(new Date(p.createdAt), day));
    return {
      date: day,
      products: productsOnDay.length,
    };
  });

  const ticks = days.map(day => day.getTime()).filter((_, i) => i % 3 === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Created (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              ticks={ticks} 
              tickFormatter={(date) => format(new Date(date), 'MMM d')} 
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Bar dataKey="products" fill="#74B5FB" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
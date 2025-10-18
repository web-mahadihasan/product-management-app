"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Product } from "@/lib/types";
import { eachDayOfInterval, subDays, format, isSameDay } from 'date-fns';

interface ProductBarChartProps {
  products: Product[];
}

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
            <Tooltip />
            {/*  */}
            <Bar dataKey="products" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

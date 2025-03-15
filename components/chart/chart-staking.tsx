import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { DateRangePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";
import { Button } from '@heroui/button';

const ChartStaking = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: parseDate("2025-01-01"),
    end: parseDate("2025-01-31")
  });

  const dailyData = [
    { date: '2025-01-25', profit: 1200, loss: -300, net: 900 },
    { date: '2025-01-26', profit: 1500, loss: -400, net: 1100 },
    { date: '2025-01-27', profit: 1300, loss: -600, net: 700 },
    { date: '2025-01-28', profit: 1800, loss: -500, net: 1300 },
    { date: '2025-01-29', profit: 1600, loss: -300, net: 1300 },
    { date: '2025-01-30', profit: 2000, loss: -2800, net: -800 },
    { date: '2025-01-31', profit: 1700, loss: -400, net: 1300 },
  ];

  const weeklyData = [
    { date: 'Week 1', profit: 8500, loss: -2500, net: 6000 },
    { date: 'Week 2', profit: 9200, loss: -3100, net: 6100 },
    { date: 'Week 3', profit: 7800, loss: -2800, net: 5000 },
    { date: 'Week 4', profit: 10500, loss: -3500, net: 7000 },
  ];

  const monthlyData = [
    { date: 'Jan', profit: 35000, loss: -12000, net: 23000 },
    { date: 'Feb', profit: 38000, loss: -13500, net: 24500 },
    { date: 'Mar', profit: 42000, loss: -15000, net: 27000 },
    { date: 'Apr', profit: 39000, loss: -14000, net: 25000 },
  ];

  const yearlyData = [
    { date: '2021', profit: 420000, loss: -150000, net: 270000 },
    { date: '2022', profit: 480000, loss: -170000, net: 310000 },
    { date: '2023', profit: 520000, loss: -180000, net: 340000 },
    { date: '2025', profit: 550000, loss: -190000, net: 360000 },
  ];

  const timeframeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(event.target.value);
  };

  const getDataByTimeframe = () => {
    if (timeframe === 'daily') {
      return dailyData.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start.toString());
        const endDate = new Date(dateRange.end.toString());
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    switch (timeframe) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return yearlyData;
      default:
        return dailyData;
    }
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/70 p-4 border rounded-xl shadow">
          <p className="text-sm font-medium">{timeframe === 'daily' && label ? new Date(label).toLocaleDateString() : label}</p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.name === 'profit' ? '#22c55e' : '#ef4444' }}>
              {entry.name}: {Math.abs(entry.value).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-background/50 flex relative">
      <Button
        className='absolute w-fit z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black bg-white'
        variant='solid'
      >
        Coming Soon
      </Button>
      <div className='absolute backdrop-blur-sm z-20 w-full h-full'></div>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Profit & Loss Overview</h2>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className='flex flex-col sm:flex-row items-center gap-1'>
            <Select
              value={timeframe}
              onChange={handleTimeframeChange}
              className="w-full sm:w-32"
              classNames={{
                trigger: "min-h-14",
              }}
              variant='bordered'
              defaultSelectedKeys={['daily']}
            >
              <>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </>
            </Select>
            <DateRangePicker
              variant='bordered'
              className='w-fit'
              value={dateRange as never}
              onChange={setDateRange as never}
              label="Date range"
              isDisabled={timeframe !== 'daily'}
            />
          </div>
          {timeframe === 'daily' && (
            <p className="text-sm text-gray-500 mt-2">
              Showing data from {dateRange.start.toString()} to {dateRange.end.toString()}
            </p>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getDataByTimeframe()}
              height={300}
              barCategoryGap={5}
            >
              <defs>
                <linearGradient
                  id="profitBar"
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={1}
                >
                  <stop
                    offset={"0"}
                    stopColor="#10B981"
                    stopOpacity={1}
                  />
                  <stop
                    offset={"1"}
                    stopColor="#10B981"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="lossBar"
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={1}
                >
                  <stop
                    offset={"0"}
                    stopColor="#ef4444"
                    stopOpacity={1}
                  />
                  <stop
                    offset={"1"}
                    stopColor="#ef4444"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray={"5 5"}
                strokeOpacity={"0.2"}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  timeframe === 'daily' ? new Date(value).toLocaleDateString() : value
                }
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Bar
                dataKey={"profit"}
                label={"Pemasukkan"}
                fill='url(#profitBar)'
                radius={[5, 5, 0, 0]}
                className="cursor-pointer"
              />
              <Bar
                dataKey={"loss"}
                label={"Pengeluaran"}
                fill='url(#lossBar)'
                radius={[5, 5, 0, 0]}
                className="cursor-pointer"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.1 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default ChartStaking;
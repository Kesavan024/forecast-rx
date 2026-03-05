import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, CalendarRange, CloudRain, Calendar, BarChart3, Rocket } from "lucide-react";
import { getSeasonalPattern, getMedicineMultiplier } from "@/constants/medicines";

interface TimeSeriesAnalyticsProps {
  medicines: string[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weatherConditions = ["Hot", "Cloudy", "Rainy"];

const generateYearlyAnalytics = (medicine: string) => {
  const multiplier = getMedicineMultiplier(medicine);
  const pattern = getSeasonalPattern(medicine);
  const baseUnits = 1000 * multiplier;

  return [2022, 2023, 2024].map((year, yi) => {
    const yearTotal = months.reduce((sum, _, mi) => {
      const growth = Math.pow(1.08, yi);
      return sum + Math.round(baseUnits * pattern[mi] * growth * (0.9 + Math.random() * 0.2));
    }, 0);
    const avgPrice = 150 + Math.random() * 50;
    return { year: year.toString(), totalUnits: yearTotal, revenue: Math.round(yearTotal * avgPrice), avgMonthly: Math.round(yearTotal / 12) };
  });
};

const generateSeasonalAnalytics = (medicine: string) => {
  const multiplier = getMedicineMultiplier(medicine);
  const pattern = getSeasonalPattern(medicine);
  const baseUnits = 1000 * multiplier;

  return months.map((month, i) => {
    const units2024 = Math.round(baseUnits * pattern[i] * 1.17 * (0.9 + Math.random() * 0.2));
    const predicted2025 = Math.round(units2024 * (1 + (Math.random() * 0.15 - 0.03)));
    const confidence = Math.round(predicted2025 * 0.12);
    return {
      month,
      actual2024: units2024,
      predicted2025,
      lowerBound: predicted2025 - confidence,
      upperBound: predicted2025 + confidence,
      seasonalIndex: pattern[i],
    };
  });
};

const generateWeatherAnalytics = (medicine: string) => {
  const multiplier = getMedicineMultiplier(medicine);
  const pattern = getSeasonalPattern(medicine);
  const baseUnits = 1000 * multiplier;
  const weatherMultipliers: Record<string, number> = { Hot: 1.1, Cloudy: 0.95, Rainy: 1.2 };

  return weatherConditions.map((weather) => {
    const wm = weatherMultipliers[weather];
    const monthlyData = months.map((month, i) => {
      const units = Math.round(baseUnits * pattern[i] * wm * (0.9 + Math.random() * 0.2));
      return { month, units, revenue: Math.round(units * (150 + Math.random() * 50)) };
    });
    const total = monthlyData.reduce((s, d) => s + d.units, 0);
    return { weather, monthlyData, totalUnits: total, avgMonthly: Math.round(total / 12) };
  });
};

const generate12MonthProjection = (medicine: string) => {
  const multiplier = getMedicineMultiplier(medicine);
  const pattern = getSeasonalPattern(medicine);
  const baseUnits = 1000 * multiplier * 1.25; // growth factor for 2025

  return months.map((month, i) => {
    const predicted = Math.round(baseUnits * pattern[i] * (0.95 + Math.random() * 0.1));
    const bestCase = Math.round(predicted * 1.15);
    const worstCase = Math.round(predicted * 0.85);
    const avgPrice = 150 + Math.random() * 50;
    return {
      month,
      predicted,
      bestCase,
      worstCase,
      revenue: Math.round(predicted * avgPrice),
      bestRevenue: Math.round(bestCase * avgPrice),
      worstRevenue: Math.round(worstCase * avgPrice),
    };
  });
};

const generateMultiYearPrediction = (medicine: string) => {
  const multiplier = getMedicineMultiplier(medicine);
  const pattern = getSeasonalPattern(medicine);
  const baseUnits = 1000 * multiplier;
  const futureYears = [2025, 2026, 2027, 2028, 2029];
  const annualGrowthRate = 0.08; // 8% annual growth

  return futureYears.map((year, yi) => {
    const growthFactor = Math.pow(1 + annualGrowthRate, yi + 3); // building on 2022 base
    const yearUnits = months.reduce((sum, _, mi) => {
      return sum + Math.round(baseUnits * pattern[mi] * growthFactor * (0.92 + Math.random() * 0.16));
    }, 0);
    const avgPrice = 150 + yi * 8 + Math.random() * 30; // slight price inflation
    const bestCase = Math.round(yearUnits * 1.18);
    const worstCase = Math.round(yearUnits * 0.82);
    return {
      year: year.toString(),
      predicted: yearUnits,
      bestCase,
      worstCase,
      revenue: Math.round(yearUnits * avgPrice),
      bestRevenue: Math.round(bestCase * avgPrice),
      worstRevenue: Math.round(worstCase * avgPrice),
      growthRate: ((growthFactor / Math.pow(1 + annualGrowthRate, yi + 2) - 1) * 100).toFixed(1),
    };
  });
};

const TimeSeriesAnalytics = ({ medicines }: TimeSeriesAnalyticsProps) => {

  const [selectedMedicine, setSelectedMedicine] = useState(medicines[0]);

  const yearlyData = useMemo(() => generateYearlyAnalytics(selectedMedicine), [selectedMedicine]);
  const seasonalData = useMemo(() => generateSeasonalAnalytics(selectedMedicine), [selectedMedicine]);
  const weatherData = useMemo(() => generateWeatherAnalytics(selectedMedicine), [selectedMedicine]);
  const projectionData = useMemo(() => generate12MonthProjection(selectedMedicine), [selectedMedicine]);
  const multiYearData = useMemo(() => generateMultiYearPrediction(selectedMedicine), [selectedMedicine]);

  const projectionTotal = projectionData.reduce((s, d) => s + d.predicted, 0);
  const projectionRevenue = projectionData.reduce((s, d) => s + d.revenue, 0);
  const yearlyGrowth = yearlyData.length >= 2
    ? (((yearlyData[2].totalUnits - yearlyData[1].totalUnits) / yearlyData[1].totalUnits) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Future Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Predictive analytics across all forecasting methods — Yearly, Seasonal, Weather-Based & 12-Month Projection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Medicine</label>
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {medicines.map((med) => (
                    <SelectItem key={med} value={med}>{med}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                <p className="text-xs text-muted-foreground">2024 Total</p>
                <p className="text-lg font-bold text-primary">{yearlyData[2]?.totalUnits.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/30 text-center">
                <p className="text-xs text-muted-foreground">YoY Growth</p>
                <p className={`text-lg font-bold flex items-center justify-center gap-1 ${parseFloat(yearlyGrowth) >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                  {parseFloat(yearlyGrowth) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {yearlyGrowth}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-chart-3/10 border border-chart-3/30 text-center">
                <p className="text-xs text-muted-foreground">2025 Projected</p>
                <p className="text-lg font-bold text-chart-3">{projectionTotal.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/30 text-center">
                <p className="text-xs text-muted-foreground">Proj. Revenue</p>
                <p className="text-lg font-bold text-chart-4">₹{(projectionRevenue / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="projection" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="projection" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">12-Month</span>
          </TabsTrigger>
          <TabsTrigger value="multiyear" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">Multi-Year</span>
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <CloudRain className="h-4 w-4" />
            <span className="hidden sm:inline">Weather</span>
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Seasonal</span>
          </TabsTrigger>
          <TabsTrigger value="yearly" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <CalendarRange className="h-4 w-4" />
            <span className="hidden sm:inline">Yearly</span>
          </TabsTrigger>
        </TabsList>

        {/* 12-Month Projection */}
        <TabsContent value="projection" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-3" />
                2025 — 12-Month Projection with Confidence Band
              </CardTitle>
              <CardDescription>Predicted units with best-case and worst-case scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="bestCase" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} name="Best Case" />
                    <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} name="Predicted" />
                    <Area type="monotone" dataKey="worstCase" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.15} name="Worst Case" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Month</th>
                      <th className="text-right py-2 px-3">Worst</th>
                      <th className="text-right py-2 px-3">Predicted</th>
                      <th className="text-right py-2 px-3">Best</th>
                      <th className="text-right py-2 px-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionData.map((row) => (
                      <tr key={row.month} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{row.month}</td>
                        <td className="text-right py-2 px-3 text-chart-4">{row.worstCase.toLocaleString()}</td>
                        <td className="text-right py-2 px-3 font-semibold">{row.predicted.toLocaleString()}</td>
                        <td className="text-right py-2 px-3 text-chart-2">{row.bestCase.toLocaleString()}</td>
                        <td className="text-right py-2 px-3">₹{row.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-Year Future Stock Predictions */}
        <TabsContent value="multiyear" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Rocket className="h-5 w-5 text-chart-3" />
                Future Stock Predictions (2025–2029)
              </CardTitle>
              <CardDescription>Multi-year demand forecast with best-case and worst-case scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={multiYearData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="worstCase" fill="hsl(var(--chart-4))" opacity={0.5} name="Worst Case" />
                    <Bar dataKey="predicted" fill="hsl(var(--primary))" name="Predicted" />
                    <Bar dataKey="bestCase" fill="hsl(var(--chart-2))" opacity={0.5} name="Best Case" />
                    <Line type="monotone" dataKey="predicted" stroke="hsl(var(--chart-3))" strokeWidth={3} dot={{ r: 5 }} name="Trend" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Projection */}
              <div className="mt-6 h-[250px]">
                <h4 className="font-semibold text-sm mb-3">Revenue Projection (₹)</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={multiYearData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="bestRevenue" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} name="Best Revenue" />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} name="Predicted Revenue" />
                    <Area type="monotone" dataKey="worstRevenue" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.1} name="Worst Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Year</th>
                      <th className="text-right py-2 px-3">Worst Case</th>
                      <th className="text-right py-2 px-3">Predicted</th>
                      <th className="text-right py-2 px-3">Best Case</th>
                      <th className="text-right py-2 px-3">Revenue</th>
                      <th className="text-right py-2 px-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiYearData.map((row) => (
                      <tr key={row.year} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{row.year}</td>
                        <td className="text-right py-2 px-3 text-chart-4">{row.worstCase.toLocaleString()}</td>
                        <td className="text-right py-2 px-3 font-semibold">{row.predicted.toLocaleString()}</td>
                        <td className="text-right py-2 px-3 text-chart-2">{row.bestCase.toLocaleString()}</td>
                        <td className="text-right py-2 px-3">₹{row.revenue.toLocaleString()}</td>
                        <td className="text-right py-2 px-3 text-chart-2 font-semibold">+{row.growthRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weather-Based Analytics */}
        <TabsContent value="weather" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-chart-1" />
                Weather-Based Demand Forecast
              </CardTitle>
              <CardDescription>How different weather conditions affect predicted demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {weatherData.map((wd) => (
                  <div key={wd.weather} className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                    <Badge variant="secondary" className="mb-2">{wd.weather}</Badge>
                    <p className="text-lg font-bold">{wd.totalUnits.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total predicted units</p>
                  </div>
                ))}
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months.map((month, i) => ({
                    month,
                    Hot: weatherData[0].monthlyData[i].units,
                    Cloudy: weatherData[1].monthlyData[i].units,
                    Rainy: weatherData[2].monthlyData[i].units,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="Hot" fill="hsl(var(--chart-1))" name="Hot" />
                    <Bar dataKey="Cloudy" fill="hsl(var(--chart-2))" name="Cloudy" />
                    <Bar dataKey="Rainy" fill="hsl(var(--chart-4))" name="Rainy" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Analytics */}
        <TabsContent value="seasonal" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-chart-2" />
                Seasonal Forecast — 2024 vs 2025 Prediction
              </CardTitle>
              <CardDescription>Comparing last year's actual data with next year's seasonal prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="upperBound" stroke="none" fill="hsl(var(--chart-2))" fillOpacity={0.1} name="Upper Bound" />
                    <Area type="monotone" dataKey="lowerBound" stroke="none" fill="hsl(var(--chart-4))" fillOpacity={0.1} name="Lower Bound" />
                    <Bar dataKey="actual2024" fill="hsl(var(--chart-1))" opacity={0.6} name="Actual 2024" />
                    <Line type="monotone" dataKey="predicted2025" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Predicted 2025" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Seasonal Index</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                  {seasonalData.map((d) => (
                    <div key={d.month} className={`p-2 rounded-lg text-center border ${d.seasonalIndex >= 1.2 ? 'bg-chart-2/10 border-chart-2/30' : d.seasonalIndex <= 0.8 ? 'bg-chart-4/10 border-chart-4/30' : 'bg-muted/50 border-border'}`}>
                      <p className="text-xs font-medium">{d.month}</p>
                      <p className="text-sm font-bold">{d.seasonalIndex.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yearly Analytics */}
        <TabsContent value="yearly" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-primary" />
                Yearly Performance & Growth (2022–2024)
              </CardTitle>
              <CardDescription>Year-over-year total units, revenue, and growth trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="totalUnits" fill="hsl(var(--primary))" name="Total Units" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Year</th>
                      <th className="text-right py-2 px-3">Total Units</th>
                      <th className="text-right py-2 px-3">Avg Monthly</th>
                      <th className="text-right py-2 px-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyData.map((row, i) => (
                      <tr key={row.year} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{row.year}</td>
                        <td className="text-right py-2 px-3">{row.totalUnits.toLocaleString()}</td>
                        <td className="text-right py-2 px-3">{row.avgMonthly.toLocaleString()}</td>
                        <td className="text-right py-2 px-3">₹{row.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeSeriesAnalytics;

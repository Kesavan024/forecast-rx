import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CalendarRange, TrendingUp, TrendingDown, Package, IndianRupee } from "lucide-react";
import { getSeasonalPattern, getMedicineMultiplier } from "@/constants/medicines";

interface YearlyForecastProps {
  medicines: string[];
}

const years = ["2022", "2023", "2024"] as const;
type Year = typeof years[number];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate monthly forecast data for a specific medicine and year
const getMonthlyForecast = (medicine: string, year: Year) => {
  const seasonalPattern = getSeasonalPattern(medicine);
  const multiplier = getMedicineMultiplier(medicine);
  
  const yearGrowth: Record<Year, number> = {
    "2022": 0.85,
    "2023": 1.0,
    "2024": 1.15,
  };
  
  // Seed random based on medicine name for consistency
  const seed = medicine.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseUnits = 120 + (seed % 80);
  const pricePerUnit = 40 + (seed % 35);
  
  return months.map((month, index) => {
    const variance = 0.9 + ((seed + index) % 20) / 100;
    const units = Math.round(baseUnits * multiplier * seasonalPattern[index] * yearGrowth[year] * variance);
    const revenue = units * pricePerUnit;
    
    return {
      month,
      units,
      revenue,
      growth: index > 0 ? ((seasonalPattern[index] - seasonalPattern[index - 1]) / seasonalPattern[index - 1] * 100).toFixed(1) : "0.0"
    };
  });
};

const YearlyForecast = ({ medicines }: YearlyForecastProps) => {
  const [selectedYear, setSelectedYear] = useState<Year>("2024");
  const [selectedMedicine, setSelectedMedicine] = useState(medicines[0] || "");

  // Update selected medicine when medicines list changes
  useMemo(() => {
    if (!medicines.includes(selectedMedicine) && medicines.length > 0) {
      setSelectedMedicine(medicines[0]);
    }
  }, [medicines, selectedMedicine]);

  const forecastData = useMemo(() => 
    getMonthlyForecast(selectedMedicine, selectedYear),
    [selectedMedicine, selectedYear]
  );

  const comparisonData = useMemo(() => {
    const data2022 = getMonthlyForecast(selectedMedicine, "2022");
    const data2023 = getMonthlyForecast(selectedMedicine, "2023");
    const data2024 = getMonthlyForecast(selectedMedicine, "2024");
    return months.map((month, i) => ({
      month,
      units2022: data2022[i].units,
      units2023: data2023[i].units,
      units2024: data2024[i].units,
    }));
  }, [selectedMedicine]);

  const stats = useMemo(() => {
    const totalUnits = forecastData.reduce((sum, m) => sum + m.units, 0);
    const totalRevenue = forecastData.reduce((sum, m) => sum + m.revenue, 0);
    const avgUnits = Math.round(totalUnits / 12);
    const peakMonth = forecastData.reduce((max, m) => m.units > max.units ? m : max, forecastData[0]);
    const lowMonth = forecastData.reduce((min, m) => m.units < min.units ? m : min, forecastData[0]);
    
    return { totalUnits, totalRevenue, avgUnits, peakMonth, lowMonth };
  }, [forecastData]);

  return (
    <div className="space-y-6">
      {/* Header with Selection Controls */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-primary" />
                Year Forecast
              </CardTitle>
              <CardDescription className="mt-1">
                Select a year and medicine to view detailed monthly forecasts
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedYear} onValueChange={(v) => setSelectedYear(v as Year)}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger className="w-full sm:w-[280px] bg-background">
                  <SelectValue placeholder="Select medicine" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border max-h-[300px]">
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine} value={medicine}>
                      {medicine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-2xl font-bold">{stats.totalUnits.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peak Month</p>
                <p className="text-lg font-bold">{stats.peakMonth.month.slice(0, 3)}</p>
                <p className="text-xs text-muted-foreground">{stats.peakMonth.units} units</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Month</p>
                <p className="text-lg font-bold">{stats.lowMonth.month.slice(0, 3)}</p>
                <p className="text-xs text-muted-foreground">{stats.lowMonth.units} units</p>
              </div>
              <TrendingDown className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{selectedYear} Monthly Forecast</CardTitle>
          <CardDescription>{selectedMedicine}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="unitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis className="text-xs" yAxisId="left" />
                <YAxis className="text-xs" yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'Revenue' ? `₹${value.toLocaleString()}` : value.toLocaleString(),
                    name
                  ]}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="units" 
                  stroke="hsl(var(--chart-1))" 
                  fill="url(#unitsGradient)"
                  strokeWidth={2}
                  name="Units"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-2))" 
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
          <CardDescription>Detailed forecast for each month in {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Forecast Units</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">MoM Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecastData.map((row, index) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right">{row.units.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {index === 0 ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <span className={parseFloat(row.growth) >= 0 ? "text-chart-3" : "text-destructive"}>
                          {parseFloat(row.growth) >= 0 ? "+" : ""}{row.growth}%
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Year-over-Year Comparison */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Year-over-Year Comparison</CardTitle>
          <CardDescription>{selectedMedicine} — 2022 vs 2023 vs 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={comparisonData}>
                <defs>
                  <linearGradient id="y2022Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="y2023Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="y2024Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tickFormatter={(v) => v.slice(0, 3)} />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [value.toLocaleString() + " units", name]}
                />
                <Legend />
                <Area type="monotone" dataKey="units2022" stroke="hsl(var(--chart-3))" fill="url(#y2022Gradient)" strokeWidth={2} name="2022" />
                <Area type="monotone" dataKey="units2023" stroke="hsl(var(--chart-1))" fill="url(#y2023Gradient)" strokeWidth={2} name="2023" />
                <Area type="monotone" dataKey="units2024" stroke="hsl(var(--chart-2))" fill="url(#y2024Gradient)" strokeWidth={2} name="2024" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Yearly Comparison Table</CardTitle>
          <CardDescription>Side-by-side monthly units for {selectedMedicine}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">2022</TableHead>
                  <TableHead className="text-right">2023</TableHead>
                  <TableHead className="text-right">2024</TableHead>
                  <TableHead className="text-right">Growth (22→24)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row) => {
                  const growthPct = row.units2022 > 0
                    ? (((row.units2024 - row.units2022) / row.units2022) * 100).toFixed(1)
                    : "0.0";
                  return (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">{row.units2022.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.units2023.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.units2024.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={parseFloat(growthPct) >= 0 ? "text-chart-3" : "text-destructive"}>
                          {parseFloat(growthPct) >= 0 ? "+" : ""}{growthPct}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyForecast;

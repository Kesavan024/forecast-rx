import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { CalendarRange, TrendingUp, Package, IndianRupee } from "lucide-react";
import { getSeasonalPattern, getMedicineMultiplier } from "@/constants/medicines";

interface YearlyForecastProps {
  medicines: string[];
}

const years = ["2022", "2023", "2024"] as const;
type Year = typeof years[number];

// Base monthly sales data with realistic patterns
const getYearlyData = (medicine: string, year: Year) => {
  const seasonalPattern = getSeasonalPattern(medicine);
  const multiplier = getMedicineMultiplier(medicine);
  
  // Year-over-year growth factors
  const yearGrowth: Record<Year, number> = {
    "2022": 0.85,
    "2023": 1.0,
    "2024": 1.15,
  };
  
  const baseUnits = 150 + Math.floor(Math.random() * 100);
  const pricePerUnit = 45 + Math.floor(Math.random() * 30);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return months.map((month, index) => {
    const units = Math.round(baseUnits * multiplier * seasonalPattern[index] * yearGrowth[year] * (0.9 + Math.random() * 0.2));
    const revenue = units * pricePerUnit;
    return {
      month,
      units,
      revenue,
    };
  });
};

// Get yearly totals for all medicines
const getYearlySummary = (medicines: string[], year: Year) => {
  return medicines.map(medicine => {
    const monthlyData = getYearlyData(medicine, year);
    const totalUnits = monthlyData.reduce((sum, m) => sum + m.units, 0);
    const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    const avgUnits = Math.round(totalUnits / 12);
    const peakMonth = monthlyData.reduce((max, m) => m.units > max.units ? m : max, monthlyData[0]);
    
    return {
      medicine,
      totalUnits,
      totalRevenue,
      avgUnits,
      peakMonth: peakMonth.month,
      peakUnits: peakMonth.units,
    };
  });
};

// Get comparison data across years
const getYearComparison = (medicine: string) => {
  return years.map(year => {
    const monthlyData = getYearlyData(medicine, year);
    const totalUnits = monthlyData.reduce((sum, m) => sum + m.units, 0);
    const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    
    return {
      year,
      units: totalUnits,
      revenue: totalRevenue,
    };
  });
};

const YearlyForecast = ({ medicines }: YearlyForecastProps) => {
  const [selectedYear, setSelectedYear] = useState<Year>("2024");
  const [selectedMedicine, setSelectedMedicine] = useState(medicines[0] || "");

  const yearlySummary = useMemo(() => 
    getYearlySummary(medicines, selectedYear).sort((a, b) => b.totalRevenue - a.totalRevenue),
    [medicines, selectedYear]
  );

  const monthlyData = useMemo(() => 
    getYearlyData(selectedMedicine, selectedYear),
    [selectedMedicine, selectedYear]
  );

  const yearComparison = useMemo(() => 
    getYearComparison(selectedMedicine),
    [selectedMedicine]
  );

  const totalStats = useMemo(() => {
    const totalUnits = yearlySummary.reduce((sum, m) => sum + m.totalUnits, 0);
    const totalRevenue = yearlySummary.reduce((sum, m) => sum + m.totalRevenue, 0);
    return { totalUnits, totalRevenue };
  }, [yearlySummary]);

  return (
    <div className="space-y-6">
      {/* Header with Year Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            Yearly Forecast ({selectedYear})
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Historical sales data and forecasts from 2022 to 2024
          </p>
        </div>
        <Select value={selectedYear} onValueChange={(v) => setSelectedYear(v as Year)}>
          <SelectTrigger className="w-[140px] bg-background">
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
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-2xl font-bold">{totalStats.totalUnits.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">₹{(totalStats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <IndianRupee className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medicines</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg/Medicine</p>
                <p className="text-2xl font-bold">₹{Math.round(totalStats.totalRevenue / medicines.length).toLocaleString()}</p>
              </div>
              <CalendarRange className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine Selection for Detailed View */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
              <CardDescription>Detailed monthly sales for selected medicine</CardDescription>
            </div>
            <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
              <SelectTrigger className="w-full sm:w-[250px] bg-background">
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
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : 'Units'
                  ]}
                />
                <Legend />
                <Bar dataKey="units" fill="hsl(var(--chart-1))" name="Units" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Year-over-Year Comparison */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Year-over-Year Comparison</CardTitle>
          <CardDescription>Compare {selectedMedicine} performance across 2022-2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `₹${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : 'Units'
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="units" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 6 }} name="Units" />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 6 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Medicines Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Medicines ({selectedYear})</CardTitle>
          <CardDescription>Ranked by total revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead className="text-right">Total Units</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Avg/Month</TableHead>
                  <TableHead>Peak Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlySummary.slice(0, 10).map((item, index) => (
                  <TableRow key={item.medicine}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.medicine}</TableCell>
                    <TableCell className="text-right">{item.totalUnits.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{item.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.avgUnits}</TableCell>
                    <TableCell>{item.peakMonth}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyForecast;

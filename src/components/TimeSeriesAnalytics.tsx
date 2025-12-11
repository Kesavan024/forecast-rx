import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, BarChart3, Layers, ArrowUpDown } from "lucide-react";

interface TimeSeriesAnalyticsProps {
  medicines: string[];
}

// Generate realistic historical sales data
const generateHistoricalData = (medicine: string) => {
  const baseMultipliers: Record<string, number> = {
    "Electral (ORS)": 1.2,
    "Neutrogena Sunscreen": 1.1,
    "Digene (Antacid)": 0.9,
    "Crocin (Paracetamol)": 1.3,
    "Livogen (Vitamin)": 0.8,
    "Benadryl Syrup (Cough)": 1.0,
    "Dolo 650 (Cough & Cold)": 1.4,
    "Cetirizine (Anti-allergy)": 1.1,
  };
  
  const seasonalPatterns: Record<string, number[]> = {
    "Electral (ORS)": [0.6, 0.7, 0.9, 1.1, 1.4, 1.5, 1.3, 1.2, 1.0, 0.8, 0.7, 0.6],
    "Neutrogena Sunscreen": [0.5, 0.6, 0.9, 1.2, 1.5, 1.6, 1.4, 1.3, 1.0, 0.7, 0.5, 0.4],
    "Crocin (Paracetamol)": [1.3, 1.2, 1.0, 0.8, 0.7, 0.6, 0.8, 0.9, 1.0, 1.1, 1.3, 1.4],
    "Benadryl Syrup (Cough)": [1.4, 1.3, 1.1, 0.8, 0.6, 0.5, 0.7, 0.8, 1.0, 1.2, 1.4, 1.5],
    "Dolo 650 (Cough & Cold)": [1.5, 1.4, 1.1, 0.8, 0.6, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.6],
    "Cetirizine (Anti-allergy)": [0.8, 0.9, 1.2, 1.4, 1.3, 1.1, 0.9, 0.8, 1.0, 1.2, 1.0, 0.8],
    "Digene (Antacid)": [1.0, 1.0, 1.1, 1.1, 1.0, 0.9, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0],
    "Livogen (Vitamin)": [1.1, 1.0, 0.9, 0.9, 1.0, 1.1, 1.1, 1.0, 0.9, 0.9, 1.0, 1.1],
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = [2022, 2023, 2024];
  const baseUnits = 1000;
  const multiplier = baseMultipliers[medicine] || 1;
  const pattern = seasonalPatterns[medicine] || Array(12).fill(1);
  
  const data: Array<{
    period: string;
    month: string;
    year: number;
    units: number;
    revenue: number;
    trend: number;
    seasonal: number;
    residual: number;
  }> = [];

  let trendValue = baseUnits * multiplier;
  const trendGrowth = 1.02; // 2% monthly growth trend

  years.forEach((year) => {
    months.forEach((month, monthIndex) => {
      const seasonalFactor = pattern[monthIndex];
      const noise = 0.9 + Math.random() * 0.2;
      const units = Math.round(trendValue * seasonalFactor * noise);
      const revenue = units * (150 + Math.random() * 50);
      
      data.push({
        period: `${month} ${year}`,
        month,
        year,
        units,
        revenue: Math.round(revenue),
        trend: Math.round(trendValue),
        seasonal: Math.round(trendValue * seasonalFactor),
        residual: Math.round(units - trendValue * seasonalFactor),
      });
      
      trendValue *= trendGrowth;
    });
  });

  return data;
};

// Detect anomalies using IQR method
const detectAnomalies = (data: Array<{ units: number; period: string }>) => {
  const units = data.map(d => d.units);
  const sorted = [...units].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return data.map(d => ({
    ...d,
    isAnomaly: d.units < lowerBound || d.units > upperBound,
    anomalyType: d.units < lowerBound ? "low" : d.units > upperBound ? "high" : null,
    lowerBound: Math.round(lowerBound),
    upperBound: Math.round(upperBound),
  }));
};

// Calculate moving average
const calculateMovingAverage = (data: Array<{ units: number }>, window: number) => {
  return data.map((item, index) => {
    if (index < window - 1) return { ...item, movingAvg: null };
    const sum = data.slice(index - window + 1, index + 1).reduce((acc, curr) => acc + curr.units, 0);
    return { ...item, movingAvg: Math.round(sum / window) };
  });
};

const TimeSeriesAnalytics = ({ medicines }: TimeSeriesAnalyticsProps) => {
  const [selectedMedicine, setSelectedMedicine] = useState(medicines[0]);
  const [comparisonYear1, setComparisonYear1] = useState("2023");
  const [comparisonYear2, setComparisonYear2] = useState("2024");

  const historicalData = useMemo(() => generateHistoricalData(selectedMedicine), [selectedMedicine]);
  const dataWithMovingAvg = useMemo(() => calculateMovingAverage(historicalData, 3), [historicalData]);
  const anomalyData = useMemo(() => detectAnomalies(historicalData), [historicalData]);

  // Comparative analysis data
  const comparativeData = useMemo(() => {
    const year1Data = historicalData.filter(d => d.year === parseInt(comparisonYear1));
    const year2Data = historicalData.filter(d => d.year === parseInt(comparisonYear2));
    
    return year1Data.map((d, i) => ({
      month: d.month,
      [`units${comparisonYear1}`]: d.units,
      [`units${comparisonYear2}`]: year2Data[i]?.units || 0,
      [`revenue${comparisonYear1}`]: d.revenue,
      [`revenue${comparisonYear2}`]: year2Data[i]?.revenue || 0,
      growth: year2Data[i] ? Math.round(((year2Data[i].units - d.units) / d.units) * 100) : 0,
    }));
  }, [historicalData, comparisonYear1, comparisonYear2]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const recentData = historicalData.slice(-12);
    const previousData = historicalData.slice(-24, -12);
    
    const recentTotal = recentData.reduce((acc, d) => acc + d.units, 0);
    const previousTotal = previousData.reduce((acc, d) => acc + d.units, 0);
    const growth = ((recentTotal - previousTotal) / previousTotal) * 100;
    
    const anomalies = anomalyData.filter(d => d.isAnomaly);
    
    return {
      totalUnits: recentTotal,
      yoyGrowth: growth.toFixed(1),
      anomalyCount: anomalies.length,
      avgUnits: Math.round(recentTotal / 12),
    };
  }, [historicalData, anomalyData]);

  return (
    <div className="space-y-6">
      {/* Header with Medicine Selection */}
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Time-Series Analytics
          </CardTitle>
          <CardDescription>
            Advanced analytics with historical trends, anomaly detection, and seasonal decomposition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Medicine</label>
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((med) => (
                    <SelectItem key={med} value={med}>{med}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                <p className="text-xs text-muted-foreground">Avg Monthly</p>
                <p className="text-lg font-bold text-primary">{stats.avgUnits.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/30 text-center">
                <p className="text-xs text-muted-foreground">YoY Growth</p>
                <p className={`text-lg font-bold flex items-center justify-center gap-1 ${parseFloat(stats.yoyGrowth) >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                  {parseFloat(stats.yoyGrowth) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {stats.yoyGrowth}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-chart-3/10 border border-chart-3/30 text-center">
                <p className="text-xs text-muted-foreground">12M Total</p>
                <p className="text-lg font-bold text-chart-3">{stats.totalUnits.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/30 text-center">
                <p className="text-xs text-muted-foreground">Anomalies</p>
                <p className="text-lg font-bold text-chart-4">{stats.anomalyCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="trends" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="anomaly" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Anomaly</span>
          </TabsTrigger>
          <TabsTrigger value="decomposition" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Seasonal</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1 py-3 text-xs sm:text-sm">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
        </TabsList>

        {/* Historical Trends Tab */}
        <TabsContent value="trends" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chart-1" />
                Historical Sales Trend with Moving Average
              </CardTitle>
              <CardDescription>
                View past sales data with 3-month moving average trend line
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dataWithMovingAvg}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 10 }} 
                      interval={5}
                      className="text-muted-foreground"
                    />
                    <YAxis className="text-muted-foreground" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="units" fill="hsl(var(--chart-1))" name="Units Sold" opacity={0.7} />
                    <Line 
                      type="monotone" 
                      dataKey="movingAvg" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={3}
                      dot={false}
                      name="3-Month Moving Avg"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="period" tick={{ fontSize: 10 }} interval={5} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--chart-3))" 
                      fill="hsl(var(--chart-3))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomaly Detection Tab */}
        <TabsContent value="anomaly" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
                Anomaly Detection (IQR Method)
              </CardTitle>
              <CardDescription>
                Identifying unusual spikes or drops in sales patterns using Interquartile Range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="period" tick={{ fontSize: 10 }} interval={5} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.period}</p>
                              <p className="text-sm">Units: {data.units.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">
                                Normal Range: {data.lowerBound.toLocaleString()} - {data.upperBound.toLocaleString()}
                              </p>
                              {data.isAnomaly && (
                                <Badge variant="destructive" className="mt-1">
                                  {data.anomalyType === 'high' ? 'Spike Detected' : 'Drop Detected'}
                                </Badge>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <ReferenceLine y={anomalyData[0]?.upperBound} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" label="Upper Bound" />
                    <ReferenceLine y={anomalyData[0]?.lowerBound} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" label="Lower Bound" />
                    <Bar 
                      dataKey="units" 
                      name="Units Sold"
                      fill="hsl(var(--chart-1))"
                      shape={(props: any) => {
                        const { x, y, width, height, payload } = props;
                        return (
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={payload.isAnomaly ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))'}
                            rx={2}
                          />
                        );
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Anomaly List */}
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Detected Anomalies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {anomalyData.filter(d => d.isAnomaly).map((anomaly, index) => (
                    <div 
                      key={index} 
                      className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2"
                    >
                      {anomaly.anomalyType === 'high' ? (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{anomaly.period}</p>
                        <p className="text-xs text-muted-foreground">
                          {anomaly.units.toLocaleString()} units ({anomaly.anomalyType} anomaly)
                        </p>
                      </div>
                    </div>
                  ))}
                  {anomalyData.filter(d => d.isAnomaly).length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-full">No anomalies detected in the data</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Decomposition Tab */}
        <TabsContent value="decomposition" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-chart-2" />
                Seasonal Decomposition
              </CardTitle>
              <CardDescription>
                Breaking down sales into trend, seasonal, and residual components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trend Component */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-1" />
                  Trend Component
                </h4>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="trend" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        dot={false}
                        name="Trend"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Seasonal Component */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2" />
                  Seasonal Component
                </h4>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="seasonal" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        dot={false}
                        name="Seasonal"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Residual Component */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-3" />
                  Residual Component (Noise)
                </h4>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} interval={5} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                      <Bar 
                        dataKey="residual" 
                        fill="hsl(var(--chart-3))"
                        name="Residual"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparative Analysis Tab */}
        <TabsContent value="comparison" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-chart-3" />
                Year-over-Year Comparison
              </CardTitle>
              <CardDescription>
                Compare sales performance across different time periods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Year 1</label>
                  <Select value={comparisonYear1} onValueChange={setComparisonYear1}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Year 2</label>
                  <Select value={comparisonYear2} onValueChange={setComparisonYear2}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey={`units${comparisonYear1}`} fill="hsl(var(--chart-1))" name={comparisonYear1} />
                    <Bar dataKey={`units${comparisonYear2}`} fill="hsl(var(--chart-2))" name={comparisonYear2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Growth Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Month</th>
                      <th className="text-right py-2 px-3">{comparisonYear1}</th>
                      <th className="text-right py-2 px-3">{comparisonYear2}</th>
                      <th className="text-right py-2 px-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativeData.map((row, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{row.month}</td>
                        <td className="text-right py-2 px-3">{row[`units${comparisonYear1}`]?.toLocaleString()}</td>
                        <td className="text-right py-2 px-3">{row[`units${comparisonYear2}`]?.toLocaleString()}</td>
                        <td className={`text-right py-2 px-3 font-semibold ${row.growth >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                          {row.growth >= 0 ? '+' : ''}{row.growth}%
                        </td>
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

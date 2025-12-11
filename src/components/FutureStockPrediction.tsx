import { useState } from "react";
import { TrendingUp, Calendar, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSeasonalPattern, getMedicineMultiplier } from "@/constants/medicines";

const months = [
  { value: "January", label: "January", season: "Winter", index: 0 },
  { value: "February", label: "February", season: "Winter", index: 1 },
  { value: "March", label: "March", season: "Spring", index: 2 },
  { value: "April", label: "April", season: "Spring", index: 3 },
  { value: "May", label: "May", season: "Summer", index: 4 },
  { value: "June", label: "June", season: "Summer", index: 5 },
  { value: "July", label: "July", season: "Monsoon", index: 6 },
  { value: "August", label: "August", season: "Monsoon", index: 7 },
  { value: "September", label: "September", season: "Monsoon", index: 8 },
  { value: "October", label: "October", season: "Autumn", index: 9 },
  { value: "November", label: "November", season: "Autumn", index: 10 },
  { value: "December", label: "December", season: "Winter", index: 11 },
];

// Get weather multiplier for any medicine
const getWeatherMultiplier = (weather: string, medicine: string): number => {
  const lowerMed = medicine.toLowerCase();
  
  // Summer medicines (ORS, Sunscreen)
  if (lowerMed.includes("ors") || lowerMed.includes("electral") || 
      lowerMed.includes("sunscreen") || lowerMed.includes("eno")) {
    if (weather === "Hot") return 1.8;
    if (weather === "Cloudy") return 0.8;
    return 0.48;
  }
  
  // Cold/Cough medicines
  if (lowerMed.includes("cough") || lowerMed.includes("cold") || 
      lowerMed.includes("benadryl") || lowerMed.includes("dolo") ||
      lowerMed.includes("crocin") || lowerMed.includes("sinarest")) {
    if (weather === "Rainy") return 1.8;
    if (weather === "Cloudy") return 1.0;
    return 0.4;
  }
  
  // Allergy medicines
  if (lowerMed.includes("allergy") || lowerMed.includes("cetirizine") ||
      lowerMed.includes("allegra") || lowerMed.includes("montair")) {
    if (weather === "Hot") return 0.8;
    if (weather === "Cloudy") return 1.2;
    return 1.4;
  }
  
  // Default
  return 1.0;
};

interface FutureStockPredictionProps {
  medicines: string[];
}

const FutureStockPrediction = ({ medicines }: FutureStockPredictionProps) => {
  const [medicine, setMedicine] = useState<string>("");
  const [forecast, setForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getNext12Months = () => {
    const currentMonth = new Date().getMonth();
    const next12 = [];
    
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i) % 12;
      next12.push(months[monthIndex]);
    }
    
    return next12;
  };

  const calculateFutureForecast = (medicineName: string) => {
    const next12Months = getNext12Months();
    const baseUnits = 250;
    const pricePerUnit = 50 + Math.random() * 30;
    const medicineMultiplier = getMedicineMultiplier(medicineName);
    const seasonalPattern = getSeasonalPattern(medicineName);
    
    return next12Months.map((month) => {
      const seasonMultiplier = seasonalPattern[month.index];
      
      // Calculate weather scenarios using the helper function
      const weatherScenarios = ["Hot", "Cloudy", "Rainy"].map(weather => ({
        weather,
        multiplier: getWeatherMultiplier(weather, medicineName),
      }));
      
      // Best case: highest weather multiplier
      const bestWeatherMultiplier = Math.max(...weatherScenarios.map(w => w.multiplier));
      const bestCase = Math.round(baseUnits * medicineMultiplier * seasonMultiplier * bestWeatherMultiplier);
      const bestCaseRevenue = Math.round(bestCase * pricePerUnit);
      
      // Worst case: lowest weather multiplier
      const worstWeatherMultiplier = Math.min(...weatherScenarios.map(w => w.multiplier));
      const worstCase = Math.round(baseUnits * medicineMultiplier * seasonMultiplier * worstWeatherMultiplier);
      const worstCaseRevenue = Math.round(worstCase * pricePerUnit);
      
      // Average case
      const avgCase = Math.round((bestCase + worstCase) / 2);
      const avgRevenue = Math.round(avgCase * pricePerUnit);
      
      return {
        month: month.label.substring(0, 3),
        fullMonth: month.label,
        season: month.season,
        bestCase,
        worstCase,
        avgCase,
        bestCaseRevenue,
        worstCaseRevenue,
        avgRevenue,
        range: bestCase - worstCase,
      };
    });
  };

  const handleGenerateForecast = async () => {
    if (!medicine) {
      toast({
        title: "Missing Information",
        description: "Please select a medicine.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const forecastData = calculateFutureForecast(medicine);
      setForecast(forecastData);
      
      // Calculate totals
      const totalBestCase = forecastData.reduce((sum, m) => sum + m.bestCase, 0);
      const totalWorstCase = forecastData.reduce((sum, m) => sum + m.worstCase, 0);
      const totalAvgCase = forecastData.reduce((sum, m) => sum + m.avgCase, 0);
      
      // Save forecast summary to database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("forecasts").insert({
          user_id: user.id,
          weather: "Future-12M-Range",
          medicine: medicine,
          month: "Next 12 Months",
          forecast_units: totalAvgCase,
          revenue: totalAvgCase * 50,
          prediction_period: "Next 12 Months",
        });
      }
      
      setIsLoading(false);
      
      toast({
        title: "Forecast Generated",
        description: "12-month future stock prediction calculated successfully.",
      });
    }, 1000);
  };

  const totalBestCase = forecast ? forecast.reduce((sum: number, m: any) => sum + m.bestCase, 0) : 0;
  const totalWorstCase = forecast ? forecast.reduce((sum: number, m: any) => sum + m.worstCase, 0) : 0;
  const totalAvgCase = forecast ? forecast.reduce((sum: number, m: any) => sum + m.avgCase, 0) : 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Future Stock Prediction
          </CardTitle>
          <CardDescription>
            12-month forecast with best-case/worst-case range combining weather and seasonal factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Medicine
            </label>
            <Select value={medicine} onValueChange={setMedicine}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select medicine for future prediction" />
              </SelectTrigger>
              <SelectContent>
                {medicines.map((med) => (
                  <SelectItem key={med} value={med}>
                    {med}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerateForecast}
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold py-6"
            size="lg"
          >
            {isLoading ? "Calculating Future Predictions..." : "Generate 12-Month Forecast"}
          </Button>
        </CardContent>
      </Card>

      {forecast && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Best Case Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-green-600">{totalBestCase.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">units over 12 months</p>
                  <p className="text-lg font-semibold text-green-700">₹{(totalBestCase * 50).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expected Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-blue-600">{totalAvgCase.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">units over 12 months</p>
                  <p className="text-lg font-semibold text-blue-700">₹{(totalAvgCase * 50).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Worst Case Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-orange-600">{totalWorstCase.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">units over 12 months</p>
                  <p className="text-lg font-semibold text-orange-700">₹{(totalWorstCase * 50).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Range Area Chart */}
          <Card className="shadow-strong border-border/50 bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">12-Month Prediction Range</CardTitle>
              </div>
              <CardDescription>
                Showing best-case and worst-case scenarios for {medicine}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={forecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                      formatter={(value: any, name: string) => {
                        const labels: Record<string, string> = {
                          bestCase: "Best Case",
                          avgCase: "Expected",
                          worstCase: "Worst Case"
                        };
                        return [value.toLocaleString() + " units", labels[name] || name];
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="bestCase" 
                      name="Best Case"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avgCase" 
                      name="Expected"
                      stroke="hsl(var(--chart-4))"
                      fill="hsl(var(--chart-4))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="worstCase" 
                      name="Worst Case"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Comparison */}
          <Card className="shadow-strong border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Revenue Projections</CardTitle>
              <CardDescription>
                Revenue comparison across scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={forecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                      formatter={(value: any, name: string) => {
                        const labels: Record<string, string> = {
                          bestCaseRevenue: "Best Case",
                          avgRevenue: "Expected",
                          worstCaseRevenue: "Worst Case"
                        };
                        return ["₹" + value.toLocaleString(), labels[name] || name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="bestCaseRevenue" name="Best Case" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avgRevenue" name="Expected" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="worstCaseRevenue" name="Worst Case" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Details Table */}
          <Card className="shadow-strong border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
              <CardDescription>
                Detailed forecast for each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-sm">Month</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Season</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Best Case</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Expected</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Worst Case</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.map((month: any, index: number) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{month.fullMonth}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs">
                            {month.season}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 font-semibold">{month.bestCase}</td>
                        <td className="py-3 px-4 text-right font-semibold">{month.avgCase}</td>
                        <td className="py-3 px-4 text-right text-orange-600 font-semibold">{month.worstCase}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">±{month.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">How This Prediction Works</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This forecast combines both weather patterns and seasonal trends. <strong>Best case</strong> assumes optimal weather conditions (high demand scenarios), while <strong>worst case</strong> assumes challenging weather conditions (low demand scenarios). The <strong>expected average</strong> represents the most likely outcome based on historical patterns. Use this range to plan inventory levels and prepare for demand variations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FutureStockPrediction;
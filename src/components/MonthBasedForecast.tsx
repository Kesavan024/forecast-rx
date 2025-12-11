import { useState } from "react";
import { Calendar, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

const getMonthForecastData = (month: string, medicine: string) => {
  const monthData = months.find((m) => m.value === month);
  const season = monthData?.season || "Spring";
  const monthIndex = monthData?.index || 0;
  
  const baseUnits = 250;
  const medicineMultiplier = getMedicineMultiplier(medicine);
  const seasonalPattern = getSeasonalPattern(medicine);
  const seasonalFactor = seasonalPattern[monthIndex];
  
  const units = Math.round(baseUnits * medicineMultiplier * seasonalFactor);
  const pricePerUnit = 50 + Math.random() * 30;
  const revenue = Math.round(units * pricePerUnit);

  return { forecast_units: units, revenue, season };
};

interface MonthBasedForecastProps {
  medicines: string[];
}

const MonthBasedForecast = ({ medicines }: MonthBasedForecastProps) => {
  const [month, setMonth] = useState<string>("");
  const [medicine, setMedicine] = useState<string>("");
  const [forecast, setForecast] = useState<{ forecast_units: number; revenue: number; season: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetForecast = async () => {
    if (!month || !medicine) {
      toast({
        title: "Missing Information",
        description: "Please select both month and medicine.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const data = getMonthForecastData(month, medicine);
      setForecast(data);
      
      // Save forecast to database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("forecasts").insert({
          user_id: user.id,
          weather: data.season,
          medicine: medicine,
          month: month,
          forecast_units: data.forecast_units,
          revenue: data.revenue,
          prediction_period: month,
        });
      }
      
      setIsLoading(false);
      
      toast({
        title: "Forecast Generated",
        description: "Month-based forecast calculated successfully.",
      });
    }, 800);
  };

  const getYearlyComparison = () => {
    if (!medicine) return [];
    return months.map((m) => {
      const data = getMonthForecastData(m.value, medicine);
      return {
        month: m.label.substring(0, 3),
        units: data.forecast_units,
        revenue: data.revenue,
      };
    });
  };

  const yearlyData = forecast ? getYearlyComparison() : [];

  return (
    <div className="space-y-6">
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Month-Based Forecast
          </CardTitle>
          <CardDescription>
            Select month and medicine to get seasonal sales predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Month
              </label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{m.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {m.season}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Medicine
              </label>
              <Select value={medicine} onValueChange={setMedicine}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select medicine" />
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
          </div>

          <Button
            onClick={handleGetForecast}
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold py-6"
            size="lg"
          >
            {isLoading ? "Calculating..." : "Get Monthly Forecast"}
          </Button>
        </CardContent>
      </Card>

      {forecast && (
        <Card className="shadow-strong border-border/50 bg-card animate-fade-in">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Monthly Forecast Results</CardTitle>
                <CardDescription>
                  {month} ({forecast.season} Season) - {medicine}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {forecast.season}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-secondary/50 border border-border/30 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Forecasted Units
                </p>
                <p className="text-4xl font-bold text-primary">
                  {forecast.forecast_units.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">units for {month}</p>
              </div>

              <div className="p-6 rounded-lg bg-accent/10 border border-accent/30 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Forecasted Revenue
                </p>
                <p className="text-4xl font-bold text-accent">
                  ₹{forecast.revenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Indian Rupees</p>
              </div>
            </div>

            {/* Yearly Trend Charts */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Yearly Trend Analysis</h3>
              </div>

              {/* Monthly Units Bar Chart */}
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Units Forecast Throughout the Year</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearlyData}>
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
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Legend />
                    <Bar dataKey="units" name="Units" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Revenue Line Chart */}
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Revenue Trend Throughout the Year</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyData}>
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
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue (₹)" 
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-4))", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonthBasedForecast;

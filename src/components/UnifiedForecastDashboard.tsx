import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Calendar, TrendingUp, Package, Activity } from "lucide-react";
import WeatherForecast from "./WeatherForecast";
import MonthBasedForecast from "./MonthBasedForecast";
import FutureStockPrediction from "./FutureStockPrediction";
import MedicalScans from "./MedicalScans";
import TimeSeriesAnalytics from "./TimeSeriesAnalytics";
const defaultMedicines = [
  "Electral (ORS)",
  "Neutrogena Sunscreen",
  "Digene (Antacid)",
  "Crocin (Paracetamol)",
  "Livogen (Vitamin)",
  "Benadryl Syrup (Cough)",
  "Dolo 650 (Cough & Cold)",
  "Cetirizine (Anti-allergy)",
];

const UnifiedForecastDashboard = () => {
  const [medicines] = useState<string[]>(defaultMedicines);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Unified Forecasting Dashboard
          </CardTitle>
          <CardDescription>
            Compare predictions across three different forecasting methods: weather-based, seasonal, and long-term stock predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/30">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="h-5 w-5 text-chart-1" />
                <h3 className="font-semibold text-sm">Weather-Based</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Predict sales based on current weather conditions
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-chart-2" />
                <h3 className="font-semibold text-sm">Month/Season-Based</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Forecast using seasonal patterns and monthly trends
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-chart-3" />
                <h3 className="font-semibold text-sm">12-Month Projection</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Long-term stock predictions with range analysis
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-chart-4/10 border border-chart-4/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-chart-4" />
                <h3 className="font-semibold text-sm">Time-Series Analytics</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Historical trends, anomaly detection & seasonal analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Forecasting Interface */}
      <Tabs defaultValue="month" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="month" className="flex items-center gap-1 py-3">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Seasonal</span>
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-1 py-3">
            <CloudRain className="h-4 w-4" />
            <span className="hidden sm:inline">Weather</span>
          </TabsTrigger>
          <TabsTrigger value="future" className="flex items-center gap-1 py-3">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">12-Month</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 py-3">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-6">
          <MonthBasedForecast medicines={medicines} />
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherForecast medicines={medicines} isStandaloneView={false} />
        </TabsContent>

        <TabsContent value="future" className="mt-6">
          <FutureStockPrediction medicines={medicines} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <TimeSeriesAnalytics medicines={medicines} />
        </TabsContent>
      </Tabs>

      {/* Medical Scans Section */}
      <MedicalScans />
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">How to Use This Dashboard</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Switch between tabs to access different forecasting methods. Each method uses different inputs 
                and algorithms to predict medicine demand. Compare results across methods for more robust planning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedForecastDashboard;

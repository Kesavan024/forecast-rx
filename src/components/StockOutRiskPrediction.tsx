import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingDown, Package, CheckCircle, AlertCircle, Info } from "lucide-react";
import { getSeasonalPattern, getMedicineMultiplier } from "@/constants/medicines";
import { getStockData, StockInfo } from "@/constants/stockData";

interface StockOutRiskPredictionProps {
  medicines: string[];
}

interface RiskAssessment {
  medicine: string;
  currentStock: number;
  forecastedDemand: number;
  stockCoverDays: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  riskScore: number;
  shortfallUnits: number;
  recommendation: string;
}

const StockOutRiskPrediction = ({ medicines }: StockOutRiskPredictionProps) => {
  const [timeHorizon] = useState(30); // 30 days forecast

  // Calculate forecasted demand for next period
  const calculateForecastedDemand = (medicine: string, days: number): number => {
    const currentMonth = new Date().getMonth();
    const seasonalPattern = getSeasonalPattern(medicine);
    const multiplier = getMedicineMultiplier(medicine);
    
    // Base daily demand (units per day)
    const baseDailyDemand = 50 * multiplier;
    
    // Apply seasonal factor
    const seasonalFactor = seasonalPattern[currentMonth];
    
    // Calculate total forecasted demand
    return Math.round(baseDailyDemand * seasonalFactor * days);
  };

  // Assess stock-out risk for each medicine
  const riskAssessments: RiskAssessment[] = useMemo(() => {
    return medicines.map((medicine) => {
      const stockInfo: StockInfo = getStockData(medicine);
      const forecastedDemand = calculateForecastedDemand(medicine, timeHorizon);
      
      // Calculate stock cover in days
      const dailyDemand = forecastedDemand / timeHorizon;
      const stockCoverDays = dailyDemand > 0 ? Math.round(stockInfo.currentStock / dailyDemand) : 999;
      
      // Calculate shortfall
      const shortfallUnits = Math.max(0, forecastedDemand - stockInfo.currentStock);
      
      // Calculate risk score (0-100)
      let riskScore: number;
      let riskLevel: "critical" | "high" | "medium" | "low";
      let recommendation: string;
      
      if (stockCoverDays <= 7) {
        riskScore = 90 + (7 - stockCoverDays) * 1.5;
        riskLevel = "critical";
        recommendation = `Urgent reorder needed! Stock will deplete in ${stockCoverDays} days. Order ${shortfallUnits + Math.round(forecastedDemand * 0.2)} units immediately.`;
      } else if (stockCoverDays <= 14) {
        riskScore = 70 + (14 - stockCoverDays) * 2.5;
        riskLevel = "high";
        recommendation = `High priority reorder. Stock coverage is only ${stockCoverDays} days. Recommend ordering ${shortfallUnits + Math.round(forecastedDemand * 0.15)} units.`;
      } else if (stockCoverDays <= 21) {
        riskScore = 40 + (21 - stockCoverDays) * 4;
        riskLevel = "medium";
        recommendation = `Schedule reorder within the week. Current stock covers ${stockCoverDays} days of demand.`;
      } else {
        riskScore = Math.max(0, 40 - (stockCoverDays - 21) * 2);
        riskLevel = "low";
        recommendation = `Stock levels adequate. ${stockCoverDays} days of coverage. Monitor as usual.`;
      }
      
      return {
        medicine,
        currentStock: stockInfo.currentStock,
        forecastedDemand,
        stockCoverDays,
        riskLevel,
        riskScore: Math.min(100, Math.max(0, riskScore)),
        shortfallUnits,
        recommendation,
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [medicines, timeHorizon]);

  // Group by risk level
  const criticalRisks = riskAssessments.filter(r => r.riskLevel === "critical");
  const highRisks = riskAssessments.filter(r => r.riskLevel === "high");
  const mediumRisks = riskAssessments.filter(r => r.riskLevel === "medium");
  const lowRisks = riskAssessments.filter(r => r.riskLevel === "low");

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-chart-5 text-white";
      case "medium": return "bg-chart-4 text-white";
      case "low": return "bg-chart-2 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <TrendingDown className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{criticalRisks.length}</p>
                <p className="text-xs text-muted-foreground">Critical Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-chart-5/50 bg-chart-5/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-chart-5" />
              <div>
                <p className="text-2xl font-bold text-chart-5">{highRisks.length}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-chart-4/50 bg-chart-4/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-chart-4" />
              <div>
                <p className="text-2xl font-bold text-chart-4">{mediumRisks.length}</p>
                <p className="text-xs text-muted-foreground">Medium Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-chart-2/50 bg-chart-2/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-chart-2" />
              <div>
                <p className="text-2xl font-bold text-chart-2">{lowRisks.length}</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical & High Risk Alert */}
      {(criticalRisks.length > 0 || highRisks.length > 0) && (
        <Card className="border-destructive/50 bg-gradient-to-r from-destructive/5 to-chart-5/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Immediate Attention Required
            </CardTitle>
            <CardDescription>
              {criticalRisks.length + highRisks.length} medicines need urgent reorder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...criticalRisks, ...highRisks].slice(0, 5).map((risk) => (
                <div 
                  key={risk.medicine} 
                  className="flex items-center justify-between p-3 rounded-lg bg-background/80 border border-border/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge className={getRiskColor(risk.riskLevel)}>
                      {getRiskIcon(risk.riskLevel)}
                    </Badge>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{risk.medicine}</p>
                      <p className="text-xs text-muted-foreground">
                        {risk.stockCoverDays} days coverage • {risk.shortfallUnits} units shortfall
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold">{risk.currentStock} units</p>
                    <p className="text-xs text-muted-foreground">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Risk Table */}
      <Card className="shadow-strong border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Stock-Out Risk Analysis
          </CardTitle>
          <CardDescription>
            30-day forecast based on seasonal patterns and demand multipliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {riskAssessments.map((risk) => (
              <div 
                key={risk.medicine}
                className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge className={`${getRiskColor(risk.riskLevel)} flex items-center gap-1`}>
                      {getRiskIcon(risk.riskLevel)}
                      <span className="capitalize">{risk.riskLevel}</span>
                    </Badge>
                    <h4 className="font-medium text-sm truncate">{risk.medicine}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-bold">{risk.riskScore.toFixed(0)}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Current Stock</p>
                    <p className="font-semibold">{risk.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">30-Day Demand</p>
                    <p className="font-semibold">{risk.forecastedDemand} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Stock Cover</p>
                    <p className="font-semibold">{risk.stockCoverDays} days</p>
                  </div>
                </div>
                
                <Progress 
                  value={100 - risk.riskScore} 
                  className="h-2 mb-2"
                />
                
                <p className="text-xs text-muted-foreground italic">
                  {risk.recommendation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Methodology Info */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Risk Assessment Methodology</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stock-out risk is calculated by comparing forecasted demand (using seasonal patterns and 
                medicine-specific multipliers) against current stock levels. Risk scores factor in days of 
                coverage: Critical (&lt;7 days), High (7-14 days), Medium (14-21 days), Low (&gt;21 days).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockOutRiskPrediction;

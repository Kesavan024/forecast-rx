import { useState, useMemo, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CloudRain, Calendar, TrendingUp, Package, Activity, Filter, Search, Pill, Folder, AlertTriangle, IndianRupee } from "lucide-react";
import WeatherForecast from "./WeatherForecast";
import MonthBasedForecast from "./MonthBasedForecast";
import FutureStockPrediction from "./FutureStockPrediction";
import MedicalScans from "./MedicalScans";
import TimeSeriesAnalytics from "./TimeSeriesAnalytics";
import StockOutRiskPrediction from "./StockOutRiskPrediction";
import LowSellingProducts from "./LowSellingProducts";
import { defaultMedicines, medicineCategories, getMedicineMultiplier } from "@/constants/medicines";

const categoryNames = ["All Categories", ...Object.keys(medicineCategories)] as const;
type CategoryName = typeof categoryNames[number];

// Calculate estimated revenue for a medicine based on base price and multiplier
const calculateMedicineRevenue = (medicine: string): number => {
  const basePrice = 50;
  const baseUnits = 100;
  const multiplier = getMedicineMultiplier(medicine);
  return basePrice * baseUnits * multiplier;
};

const UnifiedForecastDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLowSellingOnly, setShowLowSellingOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get suggestions based on search query
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return { medicines: [], categories: [] };
    
    const query = searchQuery.toLowerCase();
    
    // Filter matching medicines (limit to 5)
    const matchingMedicines = defaultMedicines
      .filter(med => med.toLowerCase().includes(query))
      .slice(0, 5);
    
    // Filter matching categories
    const matchingCategories = Object.keys(medicineCategories)
      .filter(cat => cat.toLowerCase().includes(query));
    
    return { medicines: matchingMedicines, categories: matchingCategories };
  }, [searchQuery]);

  const hasSuggestions = suggestions.medicines.length > 0 || suggestions.categories.length > 0;

  const handleSelectMedicine = (medicine: string) => {
    setSearchQuery(medicine);
    setIsSearchOpen(false);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category as CategoryName);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const filteredMedicines = useMemo(() => {
    let medicines = selectedCategory === "All Categories"
      ? defaultMedicines
      : medicineCategories[selectedCategory as keyof typeof medicineCategories] || defaultMedicines;
    
    if (searchQuery.trim()) {
      medicines = medicines.filter(med => 
        med.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter for low-selling products (revenue ₹1,000 - ₹2,000)
    if (showLowSellingOnly) {
      medicines = medicines.filter(med => {
        const revenue = calculateMedicineRevenue(med);
        return revenue >= 1000 && revenue <= 2000;
      });
    }
    
    return medicines;
  }, [selectedCategory, searchQuery, showLowSellingOnly]);

  // Get low-selling products data
  const lowSellingProducts = useMemo(() => {
    return defaultMedicines
      .map(med => ({
        medicine: med,
        revenue: calculateMedicineRevenue(med),
        multiplier: getMedicineMultiplier(med)
      }))
      .filter(item => item.revenue >= 1000 && item.revenue <= 2000)
      .sort((a, b) => a.revenue - b.revenue);
  }, []);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Unified Forecasting Dashboard
              </CardTitle>
              <CardDescription className="mt-1">
                Compare predictions across three different forecasting methods: weather-based, seasonal, and long-term stock predictions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Popover open={isSearchOpen && hasSuggestions} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      placeholder="Search medicines..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      className="pl-9 w-full sm:w-[200px] bg-background"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[200px] p-0 bg-popover border-border z-50" 
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="max-h-[300px] overflow-y-auto">
                    {suggestions.categories.length > 0 && (
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground px-2 pb-1">Categories</p>
                        {suggestions.categories.map((category) => (
                          <button
                            key={category}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                            onClick={() => handleSelectCategory(category)}
                          >
                            <Folder className="h-3.5 w-3.5 text-primary" />
                            <span>{category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {suggestions.medicines.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-muted-foreground px-2 pb-1">Medicines</p>
                        {suggestions.medicines.map((medicine) => (
                          <button
                            key={medicine}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                            onClick={() => handleSelectMedicine(medicine)}
                          >
                            <Pill className="h-3.5 w-3.5 text-chart-1" />
                            <span className="truncate">{medicine}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
                <Switch 
                  id="low-selling-filter" 
                  checked={showLowSellingOnly}
                  onCheckedChange={setShowLowSellingOnly}
                />
                <Label htmlFor="low-selling-filter" className="text-sm cursor-pointer flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Low Selling (₹1K-2K)</span>
                  <span className="sm:hidden">₹1K-2K</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CategoryName)}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-background">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {categoryNames.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
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
            
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold text-sm">Stock-Out Risk</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Predict stock-out risks using forecasted demand
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-sm">Low-Selling Products</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Identify products with revenue ₹1,000-₹2,000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Forecasting Interface */}
      <Tabs defaultValue="month" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto">
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
          <TabsTrigger value="stockout" className="flex items-center gap-1 py-3">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Stock Risk</span>
          </TabsTrigger>
          <TabsTrigger value="lowselling" className="flex items-center gap-1 py-3">
            <IndianRupee className="h-4 w-4" />
            <span className="hidden sm:inline">Low Selling</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-6">
          <MonthBasedForecast medicines={filteredMedicines} />
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherForecast medicines={filteredMedicines} isStandaloneView={false} />
        </TabsContent>

        <TabsContent value="future" className="mt-6">
          <FutureStockPrediction medicines={filteredMedicines} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <TimeSeriesAnalytics medicines={filteredMedicines} />
        </TabsContent>

        <TabsContent value="stockout" className="mt-6">
          <StockOutRiskPrediction medicines={filteredMedicines} />
        </TabsContent>

        <TabsContent value="lowselling" className="mt-6">
          <LowSellingProducts />
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

import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Plus, Search, Trash2, Package, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MonthBasedForecast from "./MonthBasedForecast";
import FutureStockPrediction from "./FutureStockPrediction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const weatherOptions = [
  { value: "Hot", label: "Hot Weather", icon: Sun, color: "text-orange-500" },
  { value: "Cloudy", label: "Cloudy", icon: Cloud, color: "text-gray-500" },
  { value: "Rainy", label: "Rainy", icon: CloudRain, color: "text-blue-500" },
];

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

const getForecastData = (weather: string, medicine: string) => {
  const baseUnits: Record<string, Record<string, number>> = {
    "Hot": {
      "Electral (ORS)": 450,
      "Neutrogena Sunscreen": 380,
      "Digene (Antacid)": 220,
      "Crocin (Paracetamol)": 180,
      "Livogen (Vitamin)": 150,
      "Benadryl Syrup (Cough)": 90,
      "Dolo 650 (Cough & Cold)": 100,
      "Cetirizine (Anti-allergy)": 140,
    },
    "Cloudy": {
      "Electral (ORS)": 200,
      "Neutrogena Sunscreen": 150,
      "Digene (Antacid)": 250,
      "Crocin (Paracetamol)": 220,
      "Livogen (Vitamin)": 180,
      "Benadryl Syrup (Cough)": 150,
      "Dolo 650 (Cough & Cold)": 160,
      "Cetirizine (Anti-allergy)": 190,
    },
    "Rainy": {
      "Electral (ORS)": 120,
      "Neutrogena Sunscreen": 80,
      "Digene (Antacid)": 180,
      "Crocin (Paracetamol)": 320,
      "Livogen (Vitamin)": 200,
      "Benadryl Syrup (Cough)": 420,
      "Dolo 650 (Cough & Cold)": 450,
      "Cetirizine (Anti-allergy)": 280,
    },
  };

  const pricePerUnit = 50;
  const units = baseUnits[weather][medicine] || 0;
  const revenue = units * pricePerUnit;

  return { forecast_units: units, revenue };
};

interface WeatherForecastProps {
  medicines?: string[];
  isStandaloneView?: boolean;
}

const WeatherForecast = ({ medicines: propMedicines, isStandaloneView = true }: WeatherForecastProps) => {
  const [weather, setWeather] = useState<string>("");
  const [medicine, setMedicine] = useState<string>("");
  const [forecast, setForecast] = useState<{ forecast_units: number; revenue: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [medicines, setMedicines] = useState<string[]>(propMedicines || defaultMedicines);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newMedicineName, setNewMedicineName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<string>("");
  const { toast } = useToast();

  // Load user session and data
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // User is logged in, could load saved medicines here if needed
      }
    };
    
    loadUserData();
  }, []);

  const filteredMedicines = medicines.filter((med) =>
    med.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMedicine = () => {
    const trimmedName = newMedicineName.trim();
    
    if (!trimmedName) {
      toast({
        title: "Invalid Input",
        description: "Please enter a medicine name.",
        variant: "destructive",
      });
      return;
    }

    if (medicines.includes(trimmedName)) {
      toast({
        title: "Duplicate Entry",
        description: "This medicine already exists in the list.",
        variant: "destructive",
      });
      return;
    }

    setMedicines([...medicines, trimmedName]);
    setNewMedicineName("");
    setIsDialogOpen(false);
    
    toast({
      title: "Medicine Added",
      description: `${trimmedName} has been added to the list.`,
    });
  };

  const handleDeleteMedicine = (medicineName: string) => {
    setMedicineToDelete(medicineName);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setMedicines(medicines.filter((med) => med !== medicineToDelete));
    
    if (medicine === medicineToDelete) {
      setMedicine("");
      setForecast(null);
    }
    
    toast({
      title: "Medicine Removed",
      description: `${medicineToDelete} has been removed from the list.`,
    });
    
    setDeleteConfirmOpen(false);
    setMedicineToDelete("");
  };

  const handleGetForecast = () => {
    if (!weather || !medicine) {
      toast({
        title: "Missing Information",
        description: "Please select both weather condition and medicine.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const data = getForecastData(weather, medicine);
      setForecast(data);
      
      // Save forecast to database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from("forecasts").insert({
          user_id: user.id,
          weather: weather,
          medicine: medicine,
          forecast_units: data.forecast_units,
          revenue: data.revenue,
          prediction_period: "Current Weather",
        });
      }
      
      setIsLoading(false);
      
      toast({
        title: "Forecast Generated",
        description: "Sales forecast has been calculated successfully.",
      });
    }, 800);
  };

  const selectedWeather = weatherOptions.find((w) => w.value === weather);

  // Generate comparison data across all weather conditions for the selected medicine
  const getComparisonData = () => {
    if (!medicine) return [];
    return weatherOptions.map((w) => {
      const data = getForecastData(w.value, medicine);
      return {
        weather: w.label,
        units: data.forecast_units,
        revenue: data.revenue,
        fill: w.value === "Hot" ? "hsl(var(--chart-1))" : w.value === "Cloudy" ? "hsl(var(--chart-2))" : "hsl(var(--chart-3))",
      };
    });
  };

  const comparisonData = forecast ? getComparisonData() : [];

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  return (
    <div className="space-y-6">
      {/* Weather-Based Forecasting */}
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-2xl">Weather-Based Forecast</CardTitle>
          <CardDescription>
            Select weather scenario and medicine to get sales predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Weather Scenario
            </label>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select weather condition" />
              </SelectTrigger>
              <SelectContent>
                {weatherOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className={`h-4 w-4 ${option.color}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Medicine
              </label>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Medicine</DialogTitle>
                    <DialogDescription>
                      Add a new medicine to the forecast list.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="medicine-name">Medicine Name</Label>
                      <Input
                        id="medicine-name"
                        placeholder="e.g., Aspirin (Pain Relief)"
                        value={newMedicineName}
                        onChange={(e) => setNewMedicineName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddMedicine();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleAddMedicine}
                      className="bg-gradient-primary"
                    >
                      Add Medicine
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={medicine} onValueChange={setMedicine}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((med) => (
                    <SelectItem key={med} value={med}>
                      {med}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No medicines found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGetForecast}
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold py-6"
            size="lg"
          >
            {isLoading ? "Calculating..." : "Get Forecast"}
          </Button>
        </CardContent>
      </Card>

      {forecast && (
        <Card className="shadow-strong border-border/50 bg-card animate-fade-in">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              {selectedWeather && (
                <selectedWeather.icon className={`h-8 w-8 ${selectedWeather.color}`} />
              )}
              <div>
                <CardTitle className="text-xl">Forecast Results</CardTitle>
                <CardDescription>
                  {weather} weather - {medicine}
                </CardDescription>
              </div>
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
                <p className="text-sm text-muted-foreground">units</p>
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

            {/* Comparison Charts */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Weather Comparison</h3>
              </div>

              {/* Units Comparison Bar Chart */}
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Units Forecast Across Weather Conditions</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="weather" 
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
                    <Bar dataKey="units" name="Units" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Comparison Line Chart */}
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Revenue Forecast Across Weather Conditions</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="weather" 
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
                      dot={{ fill: "hsl(var(--chart-4))", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Distribution Pie Chart */}
              <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Units Distribution by Weather</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={comparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ weather, units, percent }) => `${weather}: ${units} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="units"
                    >
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Medicine Inventory
              </CardTitle>
              <CardDescription>
                Total medicines: {medicines.length}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {medicines.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {medicines.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No medicines added yet</p>
              <p className="text-sm">Click "Add New" to add your first medicine</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-lg border border-border/50 bg-card hover:shadow-soft transition-all duration-200 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground flex-1 leading-relaxed">
                      {med}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteMedicine(med)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Medicine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{medicineToDelete}" from the medicine list? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WeatherForecast;

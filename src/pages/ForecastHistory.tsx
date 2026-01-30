import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  History,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";
import { exportToExcel } from "@/lib/excel-export";

interface Forecast {
  id: string;
  medicine: string;
  weather: string;
  month: string | null;
  forecast_units: number;
  revenue: number;
  prediction_period: string | null;
  created_at: string;
}

type SortField = "medicine" | "weather" | "forecast_units" | "revenue" | "created_at";
type SortOrder = "asc" | "desc";

const ForecastHistory = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isExporting, setIsExporting] = useState<"csv" | "pdf" | "excel" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from("forecasts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch forecast history.",
          variant: "destructive",
        });
      } else {
        setForecasts(data || []);
      }
    }
    setIsLoading(false);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...forecasts];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.medicine.toLowerCase().includes(query) ||
        f.weather.toLowerCase().includes(query) ||
        (f.month && f.month.toLowerCase().includes(query)) ||
        (f.prediction_period && f.prediction_period.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "medicine":
          comparison = a.medicine.localeCompare(b.medicine);
          break;
        case "weather":
          comparison = a.weather.localeCompare(b.weather);
          break;
        case "forecast_units":
          comparison = a.forecast_units - b.forecast_units;
          break;
        case "revenue":
          comparison = a.revenue - b.revenue;
          break;
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return result;
  }, [forecasts, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const handleExport = async (type: "csv" | "pdf" | "excel") => {
    if (filteredAndSortedData.length === 0) {
      toast({
        title: "No Data",
        description: "No forecast data available to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(type);
    
    setTimeout(() => {
      let success = false;
      switch (type) {
        case "csv":
          success = exportToCSV(filteredAndSortedData, "forecast_history");
          break;
        case "pdf":
          success = exportToPDF(filteredAndSortedData, "forecast_history");
          break;
        case "excel":
          success = exportToExcel(filteredAndSortedData, "forecast_history");
          break;
      }
      
      if (success) {
        toast({
          title: "Export Successful",
          description: `Exported ${filteredAndSortedData.length} forecasts as ${type.toUpperCase()}.`,
        });
      }
      setIsExporting(null);
    }, 500);
  };

  const getWeatherBadgeVariant = (weather: string) => {
    switch (weather.toLowerCase()) {
      case "hot":
        return "destructive";
      case "rainy":
        return "default";
      case "cloudy":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="icon">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                Forecast History
              </h1>
              <p className="text-sm text-muted-foreground">
                View and export all your past predictions
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-strong border-border/50">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by medicine, weather, month..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Export Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("excel")}
                  disabled={isExporting !== null}
                  className="gap-2"
                >
                  {isExporting === "excel" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 text-chart-2" />
                  )}
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("csv")}
                  disabled={isExporting !== null}
                  className="gap-2"
                >
                  {isExporting === "csv" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 text-chart-1" />
                  )}
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting !== null}
                  className="gap-2"
                >
                  {isExporting === "pdf" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 text-destructive" />
                  )}
                  PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAndSortedData.length === 0 ? (
              <div className="text-center py-16">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No forecasts found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search query" : "Start creating forecasts to see them here"}
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort("medicine")}
                            className="gap-1 -ml-3"
                          >
                            Medicine {getSortIcon("medicine")}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort("weather")}
                            className="gap-1 -ml-3"
                          >
                            Weather {getSortIcon("weather")}
                          </Button>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Month</TableHead>
                        <TableHead className="text-right">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort("forecast_units")}
                            className="gap-1 -mr-3 ml-auto"
                          >
                            Units {getSortIcon("forecast_units")}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort("revenue")}
                            className="gap-1 -mr-3 ml-auto"
                          >
                            Revenue {getSortIcon("revenue")}
                          </Button>
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">Period</TableHead>
                        <TableHead className="text-right">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort("created_at")}
                            className="gap-1 -mr-3 ml-auto"
                          >
                            Date {getSortIcon("created_at")}
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((forecast) => (
                        <TableRow key={forecast.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {forecast.medicine}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getWeatherBadgeVariant(forecast.weather)}>
                              {forecast.weather}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {forecast.month || "—"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {forecast.forecast_units.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ₹{forecast.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {forecast.prediction_period || "—"}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {format(new Date(forecast.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Showing</span>
                    <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>of {filteredAndSortedData.length} results</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-3 text-sm">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForecastHistory;

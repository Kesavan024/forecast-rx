import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Download, FileText, FileSpreadsheet, Loader2, CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";
import { cn } from "@/lib/utils";

const ForecastExport = () => {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [filteredForecasts, setFilteredForecasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<"csv" | "pdf" | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchForecasts();
  }, []);

  useEffect(() => {
    filterForecasts();
  }, [forecasts, startDate, endDate]);

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
          description: "Failed to fetch forecast data.",
          variant: "destructive",
        });
      } else {
        setForecasts(data || []);
      }
    }
    setIsLoading(false);
  };

  const filterForecasts = () => {
    let filtered = [...forecasts];
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(f => new Date(f.created_at) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(f => new Date(f.created_at) <= end);
    }
    
    setFilteredForecasts(filtered);
  };

  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleExportCSV = () => {
    if (filteredForecasts.length === 0) {
      toast({
        title: "No Data",
        description: "No forecast data available to export for the selected date range.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting("csv");
    setTimeout(() => {
      const success = exportToCSV(filteredForecasts, "medicast_forecasts");
      if (success) {
        toast({
          title: "Export Successful",
          description: `Exported ${filteredForecasts.length} forecasts as CSV.`,
        });
      }
      setIsExporting(null);
    }, 500);
  };

  const handleExportPDF = () => {
    if (filteredForecasts.length === 0) {
      toast({
        title: "No Data",
        description: "No forecast data available to export for the selected date range.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting("pdf");
    setTimeout(() => {
      const success = exportToPDF(filteredForecasts, "medicast_forecasts");
      if (success) {
        toast({
          title: "Export Successful",
          description: `Exported ${filteredForecasts.length} forecasts as PDF.`,
        });
      }
      setIsExporting(null);
    }, 500);
  };

  const hasDateFilter = startDate || endDate;

  return (
    <Card className="shadow-strong border-border/50 bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export Forecasts
        </CardTitle>
        <CardDescription>
          Download your forecast data as CSV or PDF reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Date Range Filters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Date Range Filter</label>
                {hasDateFilter && (
                  <Button variant="ghost" size="sm" onClick={clearDateFilters} className="h-7 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">From</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => (endDate ? date > endDate : false) || date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">To</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => (startDate ? date < startDate : false) || date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{filteredForecasts.length}</span> of {forecasts.length} forecast records
                  {hasDateFilter && " (filtered)"}
                </p>
                {hasDateFilter && (
                  <span className="text-xs text-muted-foreground">
                    {startDate && format(startDate, "MMM d, yyyy")}
                    {startDate && endDate && " - "}
                    {endDate && format(endDate, "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleExportCSV}
                disabled={isExporting !== null || filteredForecasts.length === 0}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                {isExporting === "csv" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                )}
                <div className="text-center">
                  <p className="font-medium">Export as CSV</p>
                  <p className="text-xs text-muted-foreground">Spreadsheet format</p>
                </div>
              </Button>

              <Button
                onClick={handleExportPDF}
                disabled={isExporting !== null || filteredForecasts.length === 0}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                {isExporting === "pdf" ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <FileText className="h-6 w-6 text-red-600" />
                )}
                <div className="text-center">
                  <p className="font-medium">Export as PDF</p>
                  <p className="text-xs text-muted-foreground">Report format</p>
                </div>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ForecastExport;

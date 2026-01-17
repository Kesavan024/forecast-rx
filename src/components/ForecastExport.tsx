import { useState, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";

const ForecastExport = () => {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<"csv" | "pdf" | null>(null);
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
          description: "Failed to fetch forecast data.",
          variant: "destructive",
        });
      } else {
        setForecasts(data || []);
      }
    }
    setIsLoading(false);
  };

  const handleExportCSV = () => {
    if (forecasts.length === 0) {
      toast({
        title: "No Data",
        description: "No forecast data available to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting("csv");
    setTimeout(() => {
      const success = exportToCSV(forecasts, "medicast_forecasts");
      if (success) {
        toast({
          title: "Export Successful",
          description: "Your forecasts have been exported as CSV.",
        });
      }
      setIsExporting(null);
    }, 500);
  };

  const handleExportPDF = () => {
    if (forecasts.length === 0) {
      toast({
        title: "No Data",
        description: "No forecast data available to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting("pdf");
    setTimeout(() => {
      const success = exportToPDF(forecasts, "medicast_forecasts");
      if (success) {
        toast({
          title: "Export Successful",
          description: "Your forecasts have been exported as PDF.",
        });
      }
      setIsExporting(null);
    }, 500);
  };

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
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{forecasts.length}</span> forecast records available for export
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleExportCSV}
                disabled={isExporting !== null || forecasts.length === 0}
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
                disabled={isExporting !== null || forecasts.length === 0}
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

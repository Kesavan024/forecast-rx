import jsPDF from "jspdf";
import "jspdf-autotable";

interface ForecastData {
  id: string;
  medicine: string;
  weather: string;
  month: string | null;
  forecast_units: number;
  revenue: number;
  prediction_period: string | null;
  created_at: string;
}

export const exportToCSV = (data: ForecastData[], filename: string = "forecasts") => {
  if (data.length === 0) {
    return false;
  }

  const headers = ["Medicine", "Weather/Season", "Month", "Forecast Units", "Revenue (₹)", "Prediction Period", "Created At"];
  
  const csvContent = [
    headers.join(","),
    ...data.map(row => [
      `"${row.medicine}"`,
      `"${row.weather}"`,
      `"${row.month || "N/A"}"`,
      row.forecast_units,
      row.revenue,
      `"${row.prediction_period || "N/A"}"`,
      `"${new Date(row.created_at).toLocaleDateString()}"`,
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

export const exportToPDF = (data: ForecastData[], filename: string = "forecasts") => {
  if (data.length === 0) {
    return false;
  }

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("MediCast Analytics - Forecast Report", 14, 22);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Summary stats
  const totalUnits = data.reduce((sum, row) => sum + row.forecast_units, 0);
  const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
  
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Summary", 14, 42);
  
  doc.setFontSize(10);
  doc.text(`Total Forecasts: ${data.length}`, 14, 50);
  doc.text(`Total Forecast Units: ${totalUnits.toLocaleString()}`, 14, 56);
  doc.text(`Total Forecast Revenue: ₹${totalRevenue.toLocaleString()}`, 14, 62);
  
  // Table
  const tableData = data.map(row => [
    row.medicine,
    row.weather,
    row.month || "N/A",
    row.forecast_units.toLocaleString(),
    `₹${row.revenue.toLocaleString()}`,
    new Date(row.created_at).toLocaleDateString(),
  ]);

  (doc as any).autoTable({
    startY: 72,
    head: [["Medicine", "Weather/Season", "Month", "Units", "Revenue", "Date"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  doc.save(`${filename}_${new Date().toISOString().split("T")[0]}.pdf`);
  
  return true;
};

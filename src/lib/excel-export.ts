import * as XLSX from "xlsx";

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

export const exportToExcel = (data: ForecastData[], filename: string = "forecasts") => {
  if (data.length === 0) {
    return false;
  }

  const worksheetData = data.map(row => ({
    "Medicine": row.medicine,
    "Weather/Season": row.weather,
    "Month": row.month || "N/A",
    "Forecast Units": row.forecast_units,
    "Revenue (₹)": row.revenue,
    "Prediction Period": row.prediction_period || "N/A",
    "Created At": new Date(row.created_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths
  worksheet["!cols"] = [
    { wch: 30 }, // Medicine
    { wch: 15 }, // Weather
    { wch: 12 }, // Month
    { wch: 15 }, // Forecast Units
    { wch: 15 }, // Revenue
    { wch: 18 }, // Prediction Period
    { wch: 15 }, // Created At
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Forecasts");
  
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
  
  return true;
};

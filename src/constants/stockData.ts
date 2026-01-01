// Stock data for medicines - simulated current stock levels
// In a real application, this would come from an inventory management system

export interface StockInfo {
  currentStock: number;
  reorderLevel: number;
  lastRestocked: string;
  supplier: string;
}

// Generate realistic stock data based on medicine category and demand patterns
const generateStockLevel = (medicine: string): number => {
  // High-demand medicines typically have lower stock due to faster turnover
  const highDemand = ["Crocin", "Dolo", "Paracetamol", "Cetirizine", "ORS", "Electral"];
  const mediumDemand = ["Benadryl", "Digene", "Combiflam", "Pan D", "Omez", "Vicks"];
  const lowDemand = ["Insulin", "Glucometer", "BP Monitor", "Pulse Oximeter"];
  
  // Simulate some medicines being critically low
  const criticallyLow = ["Dolo 650 (Paracetamol)", "Cetirizine (Anti-allergy)", "Benadryl Syrup (Cough)"];
  const moderatelyLow = ["Sinarest (Cold Relief)", "Allegra (Fexofenadine)", "Montair LC (Montelukast)", "Vicks VapoRub"];
  
  if (criticallyLow.some(m => medicine.includes(m.split(" ")[0]))) {
    return Math.floor(Math.random() * 200) + 50; // 50-250 units (very low)
  }
  
  if (moderatelyLow.some(m => medicine.includes(m.split(" ")[0]))) {
    return Math.floor(Math.random() * 400) + 200; // 200-600 units (low)
  }
  
  if (highDemand.some(m => medicine.includes(m))) {
    return Math.floor(Math.random() * 800) + 400; // 400-1200 units
  }
  
  if (mediumDemand.some(m => medicine.includes(m))) {
    return Math.floor(Math.random() * 1200) + 600; // 600-1800 units
  }
  
  if (lowDemand.some(m => medicine.includes(m))) {
    return Math.floor(Math.random() * 300) + 100; // 100-400 units (specialty items)
  }
  
  // Default stock level
  return Math.floor(Math.random() * 1000) + 500; // 500-1500 units
};

// Cache stock data to maintain consistency during session
const stockCache: Map<string, StockInfo> = new Map();

export const getStockData = (medicine: string): StockInfo => {
  if (stockCache.has(medicine)) {
    return stockCache.get(medicine)!;
  }
  
  const currentStock = generateStockLevel(medicine);
  const stockInfo: StockInfo = {
    currentStock,
    reorderLevel: Math.round(currentStock * 0.3), // Reorder at 30% of typical stock
    lastRestocked: getRandomDate(),
    supplier: getRandomSupplier(),
  };
  
  stockCache.set(medicine, stockInfo);
  return stockInfo;
};

// Helper to generate random recent date
const getRandomDate = (): string => {
  const daysAgo = Math.floor(Math.random() * 30) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Random supplier names
const suppliers = [
  "MedSupply India",
  "Pharma Distributors Ltd",
  "HealthCare Logistics",
  "Apollo Pharmacy Wholesale",
  "Sun Pharma Direct",
  "Cipla Distribution",
  "Dr. Reddy's Supply Chain",
];

const getRandomSupplier = (): string => {
  return suppliers[Math.floor(Math.random() * suppliers.length)];
};

// Get all stock data for reporting
export const getAllStockData = (medicines: string[]): Map<string, StockInfo> => {
  medicines.forEach(med => getStockData(med));
  return stockCache;
};

// Clear cache (useful for refreshing data)
export const clearStockCache = (): void => {
  stockCache.clear();
};

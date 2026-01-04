import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingDown, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { defaultMedicines, getMedicineMultiplier, medicineCategories } from "@/constants/medicines";

interface LowSellingProduct {
  medicine: string;
  revenue: number;
  multiplier: number;
  category: string;
}

// Calculate estimated revenue for a medicine
const calculateMedicineRevenue = (medicine: string): number => {
  const basePrice = 50;
  const baseUnits = 100;
  const multiplier = getMedicineMultiplier(medicine);
  return basePrice * baseUnits * multiplier;
};

// Find category for a medicine
const findCategory = (medicine: string): string => {
  for (const [category, medicines] of Object.entries(medicineCategories)) {
    if (medicines.includes(medicine)) {
      return category;
    }
  }
  return "Other";
};

const LowSellingProducts = () => {
  // Get low-selling products (revenue ₹1,000 - ₹2,000)
  const lowSellingProducts = useMemo<LowSellingProduct[]>(() => {
    return defaultMedicines
      .map(med => ({
        medicine: med,
        revenue: calculateMedicineRevenue(med),
        multiplier: getMedicineMultiplier(med),
        category: findCategory(med)
      }))
      .filter(item => item.revenue >= 1000 && item.revenue <= 2000)
      .sort((a, b) => a.revenue - b.revenue);
  }, []);

  // Group by category for analysis
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { count: number; totalRevenue: number }> = {};
    lowSellingProducts.forEach(product => {
      if (!breakdown[product.category]) {
        breakdown[product.category] = { count: 0, totalRevenue: 0 };
      }
      breakdown[product.category].count++;
      breakdown[product.category].totalRevenue += product.revenue;
    });
    return Object.entries(breakdown).map(([category, data]) => ({
      category,
      count: data.count,
      avgRevenue: Math.round(data.totalRevenue / data.count)
    }));
  }, [lowSellingProducts]);

  const totalRevenue = lowSellingProducts.reduce((sum, p) => sum + p.revenue, 0);
  const avgRevenue = lowSellingProducts.length > 0 
    ? Math.round(totalRevenue / lowSellingProducts.length) 
    : 0;

  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/20">
                <Package className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low-Selling Products</p>
                <p className="text-2xl font-bold">{lowSellingProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/20">
                <IndianRupee className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-3/20">
                <TrendingDown className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Revenue/Product</p>
                <p className="text-2xl font-bold">₹{avgRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Chart */}
      <Card className="border-border/50 shadow-strong">
        <CardHeader>
          <CardTitle className="text-lg">Low-Selling Products by Category</CardTitle>
          <CardDescription>
            Distribution of products with revenue ₹1,000 - ₹2,000 across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="category" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))"
                  }}
                  formatter={(value: number, name: string) => [
                    name === "count" ? `${value} products` : `₹${value}`,
                    name === "count" ? "Products" : "Avg Revenue"
                  ]}
                />
                <Bar dataKey="count" name="count" radius={[4, 4, 0, 0]}>
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No low-selling products found in the ₹1,000 - ₹2,000 range
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-border/50 shadow-strong">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Low-Selling Products List
          </CardTitle>
          <CardDescription>
            Products with estimated revenue between ₹1,000 and ₹2,000
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lowSellingProducts.length > 0 ? (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Medicine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-center">Demand Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowSellingProducts.map((product, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{product.medicine}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₹{product.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary"
                          className={
                            product.multiplier < 0.7 
                              ? "bg-destructive/20 text-destructive" 
                              : product.multiplier < 1.0 
                                ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {product.multiplier < 0.7 ? "Very Low" : product.multiplier < 1.0 ? "Low" : "Medium"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No products found in the specified revenue range
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Understanding Low-Selling Products</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Products in the ₹1,000 - ₹2,000 revenue range may indicate low demand, overstocking, 
                or pricing issues. Consider promotional strategies, bundle offers, or inventory 
                adjustments to improve sales performance for these items.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LowSellingProducts;
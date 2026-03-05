import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Scan, Stethoscope, Pill, TrendingUp, IndianRupee, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getSeasonalPattern, getMedicineMultiplier } from "@/constants/medicines";
import mriScan from "@/assets/mri-scan.png";
import ecoScan from "@/assets/eco-scan.png";
import xrayScan from "@/assets/xray-scan.png";
import ctScan from "@/assets/ct-scan.png";
import petScan from "@/assets/pet-scan.png";

interface ScanInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  symptoms: string[];
  medicines: { name: string; usage: string }[];
}

const scans: ScanInfo[] = [
  {
    id: "mri",
    name: "MRI Scan",
    description: "Magnetic Resonance Imaging for detailed soft tissue analysis",
    image: mriScan,
    category: "Neurological",
    symptoms: [
      "Chronic headaches & migraines",
      "Dizziness or vertigo",
      "Numbness or tingling in limbs",
      "Memory loss or confusion",
      "Seizures or convulsions",
      "Back pain with nerve involvement",
      "Joint pain or swelling",
    ],
    medicines: [
      { name: "Combiflam (Ibuprofen+Paracetamol)", usage: "Pain & inflammation relief" },
      { name: "Dolo 650 (Paracetamol)", usage: "Headache & fever management" },
      { name: "Voveran (Diclofenac)", usage: "Severe joint/back pain" },
      { name: "Flexon MR (Muscle Relaxant)", usage: "Muscle spasm relief" },
      { name: "Thiocolchicoside", usage: "Nerve-related muscle pain" },
      { name: "Alprazolam", usage: "Anxiety-related neurological symptoms" },
    ],
  },
  {
    id: "ct",
    name: "CT Scan",
    description: "Computed Tomography for detailed cross-sectional imaging",
    image: ctScan,
    category: "General Diagnostic",
    symptoms: [
      "Persistent abdominal pain",
      "Unexplained weight loss",
      "Chronic cough with blood",
      "Severe chest pain",
      "Head injury or trauma",
      "Kidney stones or urinary issues",
      "Suspected internal bleeding",
    ],
    medicines: [
      { name: "Pan D (Pantoprazole)", usage: "Acid reflux & stomach ulcers" },
      { name: "Omez (Omeprazole)", usage: "Gastric protection" },
      { name: "Norflox TZ (Antibiotic)", usage: "Abdominal infections" },
      { name: "Crocin (Paracetamol)", usage: "Pain & fever management" },
      { name: "Ciprofloxacin", usage: "Urinary tract infections" },
      { name: "Metronidazole (Flagyl)", usage: "Bacterial infections" },
    ],
  },
  {
    id: "pet",
    name: "PET Scan",
    description: "Positron Emission Tomography for metabolic activity detection",
    image: petScan,
    category: "Oncology",
    symptoms: [
      "Unexplained lumps or masses",
      "Persistent fatigue & weakness",
      "Rapid unexplained weight loss",
      "Night sweats",
      "Swollen lymph nodes",
      "Persistent bone pain",
      "Changes in skin moles",
    ],
    medicines: [
      { name: "Dolo 650 (Paracetamol)", usage: "Pain & fever management" },
      { name: "Ultracet (Tramadol)", usage: "Moderate to severe pain" },
      { name: "Econorm (Probiotic)", usage: "Gut health during treatment" },
      { name: "Livogen (Iron+Folic Acid)", usage: "Anemia support" },
      { name: "Supradyn (Multivitamin)", usage: "Nutritional supplementation" },
      { name: "Zincovit (Zinc+Vitamins)", usage: "Immune system support" },
    ],
  },
  {
    id: "eco",
    name: "ECO Scan",
    description: "Echocardiogram ultrasound for cardiac assessment",
    image: ecoScan,
    category: "Cardiovascular",
    symptoms: [
      "Chest pain or tightness",
      "Shortness of breath",
      "Heart palpitations",
      "Swelling in legs or ankles",
      "Fainting or lightheadedness",
      "Irregular heartbeat",
      "Excessive fatigue during activity",
    ],
    medicines: [
      { name: "Amlodipine", usage: "Blood pressure control" },
      { name: "Atenolol", usage: "Heart rate regulation" },
      { name: "Telmisartan", usage: "Hypertension management" },
      { name: "Aspirin 75mg (Ecosprin)", usage: "Blood thinning & clot prevention" },
      { name: "Atorvastatin", usage: "Cholesterol management" },
      { name: "Clopidogrel", usage: "Prevent blood clots" },
    ],
  },
  {
    id: "xray",
    name: "X-Ray",
    description: "Radiographic imaging for bones and chest examination",
    image: xrayScan,
    category: "General Diagnostic",
    symptoms: [
      "Bone fractures or joint injuries",
      "Persistent cough (>2 weeks)",
      "Chest congestion & breathing difficulty",
      "Suspected pneumonia or TB",
      "Dental pain or jaw issues",
      "Scoliosis or spinal misalignment",
      "Swallowed foreign objects",
    ],
    medicines: [
      { name: "Combiflam (Ibuprofen+Paracetamol)", usage: "Pain & swelling relief" },
      { name: "Brufen (Ibuprofen)", usage: "Anti-inflammatory for injuries" },
      { name: "Shelcal (Calcium+D3)", usage: "Bone strengthening" },
      { name: "Azithromycin (Azee)", usage: "Respiratory infections" },
      { name: "Amoxicillin", usage: "Bacterial chest infections" },
      { name: "Volini Gel", usage: "Topical pain relief for joints" },
      { name: "Asthalin Inhaler", usage: "Breathing difficulty relief" },
    ],
  },
];

const generateMedicinePrediction = (medName: string) => {
  const multiplier = getMedicineMultiplier(medName);
  const seasonalPattern = getSeasonalPattern(medName);
  const baseUnits = 250;
  const pricePerUnit = 50 + (medName.length % 10) * 3; // deterministic per medicine

  const currentMonth = new Date().getMonth();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const next6 = [];
  for (let i = 0; i < 6; i++) {
    const idx = (currentMonth + i) % 12;
    const units = Math.round(baseUnits * multiplier * seasonalPattern[idx]);
    const revenue = Math.round(units * pricePerUnit);
    next6.push({ month: monthNames[idx], units, revenue });
  }
  return { data: next6, pricePerUnit, totalUnits: next6.reduce((s, d) => s + d.units, 0), totalRevenue: next6.reduce((s, d) => s + d.revenue, 0) };
};

const MedicalScans = () => {
  const [selectedScan, setSelectedScan] = useState<ScanInfo | null>(null);

  const predictions = useMemo(() => {
    if (!selectedScan) return [];
    return selectedScan.medicines.map(med => ({
      ...med,
      prediction: generateMedicinePrediction(med.name),
    }));
  }, [selectedScan]);

  const aggregatedChart = useMemo(() => {
    if (!predictions.length) return [];
    const monthMap: Record<string, { month: string; totalUnits: number; totalRevenue: number }> = {};
    predictions.forEach(p => {
      p.prediction.data.forEach(d => {
        if (!monthMap[d.month]) monthMap[d.month] = { month: d.month, totalUnits: 0, totalRevenue: 0 };
        monthMap[d.month].totalUnits += d.units;
        monthMap[d.month].totalRevenue += d.revenue;
      });
    });
    return Object.values(monthMap);
  }, [predictions]);

  const grandTotalUnits = predictions.reduce((s, p) => s + p.prediction.totalUnits, 0);
  const grandTotalRevenue = predictions.reduce((s, p) => s + p.prediction.totalRevenue, 0);

  return (
    <>
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            Medical Imaging Services
          </CardTitle>
          <CardDescription>
            Click on any scan to view related symptoms, recommended medicines & future demand predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={scan.image}
                    alt={scan.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2">
                    {scan.category}
                  </span>
                  <h3 className="font-semibold text-foreground">{scan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scan.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedScan} onOpenChange={(open) => !open && setSelectedScan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedScan && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedScan.image}
                    alt={selectedScan.name}
                    className="h-16 w-16 rounded-lg object-cover border border-border"
                  />
                  <div>
                    <DialogTitle className="text-lg">{selectedScan.name}</DialogTitle>
                    <DialogDescription>{selectedScan.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Symptoms */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Stethoscope className="h-4 w-4 text-destructive" />
                    Common Symptoms Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScan.symptoms.map((symptom, i) => (
                      <Badge key={i} variant="outline" className="text-xs py-1">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Medicines with predictions */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Pill className="h-4 w-4 text-primary" />
                    Recommended Medicines & 6-Month Demand Forecast
                  </h4>
                  <div className="space-y-2">
                    {predictions.map((med, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{med.name}</p>
                            <p className="text-xs text-muted-foreground">{med.usage}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-primary">{med.prediction.totalUnits.toLocaleString()} units</p>
                            <p className="text-xs text-muted-foreground">₹{med.prediction.totalRevenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aggregated Prediction Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                    Combined 6-Month Forecast
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">Total Stock Needed</span>
                      </div>
                      <p className="text-xl font-bold text-foreground">{grandTotalUnits.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">units across all medicines</p>
                    </div>
                    <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/30">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-chart-2" />
                        <span className="text-xs font-medium text-muted-foreground">Projected Revenue</span>
                      </div>
                      <p className="text-xl font-bold text-foreground">₹{grandTotalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">estimated over 6 months</p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={aggregatedChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: any, name: string) => {
                            if (name === "totalRevenue") return ["₹" + value.toLocaleString(), "Revenue"];
                            return [value.toLocaleString() + " units", "Stock"];
                          }}
                        />
                        <Legend />
                        <Bar dataKey="totalUnits" name="Stock (units)" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="totalRevenue" name="Revenue (₹)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
                  ⚠️ This is for informational purposes only. Always consult a qualified healthcare professional before taking any medication. Predictions are based on seasonal demand patterns.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicalScans;

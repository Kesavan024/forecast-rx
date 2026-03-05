import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Scan, Stethoscope, Pill } from "lucide-react";
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

const MedicalScans = () => {
  const [selectedScan, setSelectedScan] = useState<ScanInfo | null>(null);

  return (
    <>
      <Card className="shadow-strong border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            Medical Imaging Services
          </CardTitle>
          <CardDescription>
            Click on any scan to view related symptoms and recommended medicines
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
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

                {/* Medicines */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Pill className="h-4 w-4 text-primary" />
                    Recommended Medicines
                  </h4>
                  <div className="space-y-2">
                    {selectedScan.medicines.map((med, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{med.name}</p>
                          <p className="text-xs text-muted-foreground">{med.usage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
                  ⚠️ This is for informational purposes only. Always consult a qualified healthcare professional before taking any medication.
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

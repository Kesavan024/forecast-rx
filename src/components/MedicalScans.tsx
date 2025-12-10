import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan } from "lucide-react";
import mriScan from "@/assets/mri-scan.png";
import ecoScan from "@/assets/eco-scan.png";
import xrayScan from "@/assets/xray-scan.png";

const scans = [
  {
    id: "mri",
    name: "MRI Scan",
    description: "Magnetic Resonance Imaging for detailed soft tissue analysis",
    image: mriScan,
    category: "Neurological",
  },
  {
    id: "eco",
    name: "ECO Scan",
    description: "Echocardiogram ultrasound for cardiac assessment",
    image: ecoScan,
    category: "Cardiovascular",
  },
  {
    id: "xray",
    name: "X-Ray",
    description: "Radiographic imaging for bones and chest examination",
    image: xrayScan,
    category: "General Diagnostic",
  },
];

const MedicalScans = () => {
  return (
    <Card className="shadow-strong border-border/50 bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Scan className="h-5 w-5 text-primary" />
          Medical Imaging Services
        </CardTitle>
        <CardDescription>
          Advanced diagnostic imaging options available at our facility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30"
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
  );
};

export default MedicalScans;

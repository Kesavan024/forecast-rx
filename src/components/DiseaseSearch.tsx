import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Pill, Stethoscope, Tag } from "lucide-react";
import { searchDiseases, getMedicinesForDisease, getAllDiseases } from "@/constants/medicines";

const DiseaseSearch = () => {
  const [diseaseQuery, setDiseaseQuery] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const matchingDiseases = useMemo(() => {
    return searchDiseases(diseaseQuery);
  }, [diseaseQuery]);

  const selectedDiseaseData = useMemo(() => {
    if (!selectedDisease) return null;
    return getMedicinesForDisease(selectedDisease);
  }, [selectedDisease]);

  const handleDiseaseSelect = (disease: string) => {
    setSelectedDisease(disease);
    setDiseaseQuery(disease);
  };

  const clearSelection = () => {
    setSelectedDisease(null);
    setDiseaseQuery("");
  };

  return (
    <Card className="shadow-strong border-border/50 bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Disease to Medicine Lookup
        </CardTitle>
        <CardDescription>
          Search for a disease or condition to find recommended medicines with their categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search diseases (e.g., fever, headache, cold, diabetes...)"
            value={diseaseQuery}
            onChange={(e) => {
              setDiseaseQuery(e.target.value);
              if (selectedDisease && e.target.value !== selectedDisease) {
                setSelectedDisease(null);
              }
            }}
            className="pl-9 bg-background"
          />
        </div>

        {/* Suggestions Dropdown */}
        {diseaseQuery && !selectedDisease && matchingDiseases.length > 0 && (
          <div className="border border-border rounded-lg bg-background shadow-lg max-h-48 overflow-y-auto">
            {matchingDiseases.map((disease) => (
              <button
                key={disease}
                onClick={() => handleDiseaseSelect(disease)}
                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2 capitalize"
              >
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                {disease}
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {diseaseQuery && !selectedDisease && matchingDiseases.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No diseases found matching "{diseaseQuery}"
          </div>
        )}

        {/* Selected Disease Results */}
        {selectedDisease && selectedDiseaseData && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold capitalize">{selectedDisease}</h3>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {selectedDiseaseData.category}
                </Badge>
              </div>
              <button
                onClick={clearSelection}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDiseaseData.medicines.map((medicine, index) => (
                <div
                  key={medicine}
                  className="p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <Pill className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{medicine}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended #{index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Always consult a healthcare professional before taking any medication.
            </p>
          </div>
        )}

        {/* Quick Access - Popular Diseases */}
        {!diseaseQuery && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Popular Searches</h4>
            <div className="flex flex-wrap gap-2">
              {["fever", "headache", "cold", "cough", "acidity", "diabetes", "allergy", "muscle pain"].map((disease) => (
                <Badge
                  key={disease}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
                  onClick={() => handleDiseaseSelect(disease)}
                >
                  {disease}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseaseSearch;
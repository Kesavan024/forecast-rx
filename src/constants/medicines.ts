// Comprehensive list of medicines for the forecasting platform
export const defaultMedicines = [
  // Pain & Fever
  "Crocin (Paracetamol)",
  "Dolo 650 (Paracetamol)",
  "Combiflam (Ibuprofen+Paracetamol)",
  "Disprin (Aspirin)",
  "Brufen (Ibuprofen)",
  "Nise (Nimesulide)",
  "Voveran (Diclofenac)",
  "Ultracet (Tramadol)",
  "Sumo (Nimesulide+Paracetamol)",
  "Saridon (Paracetamol+Caffeine)",
  
  // Cough & Cold
  "Benadryl Syrup (Cough)",
  "Cetirizine (Anti-allergy)",
  "Allegra (Fexofenadine)",
  "Montair LC (Montelukast)",
  "Sinarest (Cold Relief)",
  "Vicks VapoRub",
  "Otrivin Nasal Spray",
  "Asthalin Inhaler",
  "Levolin Inhaler",
  "Grilinctus Syrup",
  "Chericof Syrup",
  "Honitus Syrup",
  
  // Digestive & Gastric
  "Digene (Antacid)",
  "Gelusil MPS (Antacid)",
  "Eno (Antacid)",
  "Pan D (Pantoprazole)",
  "Omez (Omeprazole)",
  "Ranitidine",
  "Dulcolax (Laxative)",
  "Cremaffin (Laxative)",
  "Imodium (Anti-diarrheal)",
  "Norflox TZ (Antibiotic)",
  "ORS Electral",
  "Econorm (Probiotic)",
  "Enterogermina (Probiotic)",
  
  // Vitamins & Supplements
  "Livogen (Iron+Folic Acid)",
  "Shelcal (Calcium+D3)",
  "Becosules (B-Complex)",
  "Supradyn (Multivitamin)",
  "Zincovit (Zinc+Vitamins)",
  "Limcee (Vitamin C)",
  "Evion (Vitamin E)",
  "Revital (Multivitamin)",
  "A to Z NS (Multivitamin)",
  "Calcimax P (Calcium)",
  
  // Skin Care & Dermatology
  "Neutrogena Sunscreen",
  "Betadine (Antiseptic)",
  "Soframycin (Antibiotic Cream)",
  "Candid B (Antifungal)",
  "Clobetasol Cream",
  "Dermadew Soap",
  "Lacto Calamine Lotion",
  "Boroline (Antiseptic Cream)",
  "Dettol Antiseptic",
  "Himalaya Neem Face Wash",
  
  // Eye & Ear Care
  "Ciprofloxacin Eye Drops",
  "Moxifloxacin Eye Drops",
  "Tears Naturale (Eye Lubricant)",
  "Otorex Ear Drops",
  "Ciplox D Eye Drops",
  
  // Antibiotics & Anti-infectives
  "Amoxicillin",
  "Azithromycin (Azee)",
  "Ciprofloxacin",
  "Metronidazole (Flagyl)",
  "Cefixime (Zifi)",
  "Augmentin (Amox+Clav)",
  "Ofloxacin",
  "Doxycycline",
  
  // Diabetes Care
  "Metformin",
  "Glimepiride",
  "Glucometer Strips",
  "Insulin Syringes",
  
  // Cardiac & BP
  "Amlodipine",
  "Atenolol",
  "Telmisartan",
  "Aspirin 75mg (Ecosprin)",
  "Atorvastatin",
  "Clopidogrel",
  
  // Women's Health
  "Meftal Spas (Mefenamic)",
  "Cyclopam (Antispasmodic)",
  "Folvite (Folic Acid)",
  "Dydrogesterone",
  "i-Pill (Emergency Contraceptive)",
  
  // First Aid & Emergency
  "Electral (ORS)",
  "Band-Aid",
  "Cotton Roll",
  "Surgical Tape",
  "Thermometer",
  "BP Monitor",
  "Pulse Oximeter",
  
  // Mental Health & Sleep
  "Alprazolam",
  "Clonazepam",
  "Melatonin",
  
  // Muscle & Joint
  "Volini Gel",
  "Moov Spray",
  "Iodex Balm",
  "Flexon MR (Muscle Relaxant)",
  "Thiocolchicoside",
];

// Medicine categories for filtering
export const medicineCategories = {
  "Pain & Fever": [
    "Crocin (Paracetamol)", "Dolo 650 (Paracetamol)", "Combiflam (Ibuprofen+Paracetamol)",
    "Disprin (Aspirin)", "Brufen (Ibuprofen)", "Nise (Nimesulide)", "Voveran (Diclofenac)",
    "Ultracet (Tramadol)", "Sumo (Nimesulide+Paracetamol)", "Saridon (Paracetamol+Caffeine)"
  ],
  "Cough & Cold": [
    "Benadryl Syrup (Cough)", "Cetirizine (Anti-allergy)", "Allegra (Fexofenadine)",
    "Montair LC (Montelukast)", "Sinarest (Cold Relief)", "Vicks VapoRub", "Otrivin Nasal Spray",
    "Asthalin Inhaler", "Levolin Inhaler", "Grilinctus Syrup", "Chericof Syrup", "Honitus Syrup"
  ],
  "Digestive & Gastric": [
    "Digene (Antacid)", "Gelusil MPS (Antacid)", "Eno (Antacid)", "Pan D (Pantoprazole)",
    "Omez (Omeprazole)", "Ranitidine", "Dulcolax (Laxative)", "Cremaffin (Laxative)",
    "Imodium (Anti-diarrheal)", "Norflox TZ (Antibiotic)", "ORS Electral", "Econorm (Probiotic)",
    "Enterogermina (Probiotic)"
  ],
  "Vitamins & Supplements": [
    "Livogen (Iron+Folic Acid)", "Shelcal (Calcium+D3)", "Becosules (B-Complex)",
    "Supradyn (Multivitamin)", "Zincovit (Zinc+Vitamins)", "Limcee (Vitamin C)",
    "Evion (Vitamin E)", "Revital (Multivitamin)", "A to Z NS (Multivitamin)", "Calcimax P (Calcium)"
  ],
  "Skin Care": [
    "Neutrogena Sunscreen", "Betadine (Antiseptic)", "Soframycin (Antibiotic Cream)",
    "Candid B (Antifungal)", "Clobetasol Cream", "Dermadew Soap", "Lacto Calamine Lotion",
    "Boroline (Antiseptic Cream)", "Dettol Antiseptic", "Himalaya Neem Face Wash"
  ],
  "Eye & Ear Care": [
    "Ciprofloxacin Eye Drops", "Moxifloxacin Eye Drops", "Tears Naturale (Eye Lubricant)",
    "Otorex Ear Drops", "Ciplox D Eye Drops"
  ],
  "Antibiotics": [
    "Amoxicillin", "Azithromycin (Azee)", "Ciprofloxacin", "Metronidazole (Flagyl)",
    "Cefixime (Zifi)", "Augmentin (Amox+Clav)", "Ofloxacin", "Doxycycline"
  ],
  "Diabetes Care": [
    "Metformin", "Glimepiride", "Glucometer Strips", "Insulin Syringes"
  ],
  "Cardiac & BP": [
    "Amlodipine", "Atenolol", "Telmisartan", "Aspirin 75mg (Ecosprin)", "Atorvastatin", "Clopidogrel"
  ],
  "Women's Health": [
    "Meftal Spas (Mefenamic)", "Cyclopam (Antispasmodic)", "Folvite (Folic Acid)",
    "Dydrogesterone", "i-Pill (Emergency Contraceptive)"
  ],
  "First Aid": [
    "Electral (ORS)", "Band-Aid", "Cotton Roll", "Surgical Tape", "Thermometer", "BP Monitor", "Pulse Oximeter"
  ],
  "Muscle & Joint": [
    "Volini Gel", "Moov Spray", "Iodex Balm", "Flexon MR (Muscle Relaxant)", "Thiocolchicoside"
  ]
};

// Seasonal patterns for different medicine categories
export const getSeasonalPattern = (medicine: string): number[] => {
  // Default seasonal pattern (relatively stable)
  const defaultPattern = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  
  // Summer peak medicines (Mar-Jun)
  const summerPeakMeds = ["Electral (ORS)", "ORS Electral", "Neutrogena Sunscreen", "Eno (Antacid)", "Gelusil MPS (Antacid)"];
  if (summerPeakMeds.some(m => medicine.includes(m.split(" ")[0]))) {
    return [0.6, 0.7, 0.9, 1.3, 1.5, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.5];
  }
  
  // Winter peak medicines (Oct-Feb) - Cold & Cough
  const winterPeakMeds = ["Crocin", "Dolo", "Benadryl", "Sinarest", "Vicks", "Grilinctus", "Chericof", "Honitus"];
  if (winterPeakMeds.some(m => medicine.includes(m))) {
    return [1.4, 1.3, 1.1, 0.8, 0.6, 0.5, 0.6, 0.8, 1.0, 1.2, 1.4, 1.5];
  }
  
  // Monsoon peak medicines (Jun-Sep) - Infections, Digestive
  const monsoonPeakMeds = ["Norflox", "Metronidazole", "Imodium", "Econorm", "Enterogermina", "Ciprofloxacin"];
  if (monsoonPeakMeds.some(m => medicine.includes(m))) {
    return [0.7, 0.7, 0.8, 0.9, 1.0, 1.3, 1.5, 1.4, 1.3, 1.0, 0.8, 0.7];
  }
  
  // Allergy medicines (Spring - Mar-May)
  const allergyMeds = ["Cetirizine", "Allegra", "Montair"];
  if (allergyMeds.some(m => medicine.includes(m))) {
    return [0.8, 0.9, 1.3, 1.5, 1.4, 1.1, 0.9, 0.8, 0.9, 1.1, 1.0, 0.8];
  }
  
  // Vitamins - New Year resolution peak
  const vitaminMeds = ["Livogen", "Shelcal", "Becosules", "Supradyn", "Zincovit", "Revital", "A to Z"];
  if (vitaminMeds.some(m => medicine.includes(m))) {
    return [1.4, 1.3, 1.1, 1.0, 0.9, 0.9, 0.9, 0.9, 1.0, 1.0, 1.1, 1.2];
  }
  
  // Pain relievers - slight winter peak
  const painMeds = ["Combiflam", "Brufen", "Nise", "Voveran", "Ultracet", "Sumo", "Saridon"];
  if (painMeds.some(m => medicine.includes(m))) {
    return [1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.9, 0.9, 1.0, 1.1, 1.2, 1.3];
  }
  
  // Muscle & Joint - winter peak
  const muscleMeds = ["Volini", "Moov", "Iodex", "Flexon", "Thiocolchicoside"];
  if (muscleMeds.some(m => medicine.includes(m))) {
    return [1.3, 1.2, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.4];
  }
  
  return defaultPattern;
};

// Base multiplier for medicine pricing/volume
export const getMedicineMultiplier = (medicine: string): number => {
  // High volume medicines
  const highVolume = ["Crocin", "Dolo", "Paracetamol", "Cetirizine", "Electral", "ORS"];
  if (highVolume.some(m => medicine.includes(m))) return 1.4;
  
  // Medium-high volume
  const mediumHigh = ["Benadryl", "Digene", "Combiflam", "Pan D", "Omez"];
  if (mediumHigh.some(m => medicine.includes(m))) return 1.2;
  
  // Medium volume
  const medium = ["Livogen", "Shelcal", "Becosules", "Vicks", "Betadine"];
  if (medium.some(m => medicine.includes(m))) return 1.0;
  
  // Lower volume (specialty)
  const specialty = ["Insulin", "Glucometer", "BP Monitor", "Pulse Oximeter"];
  if (specialty.some(m => medicine.includes(m))) return 0.6;
  
  // Default
  return 0.9;
};

// Disease to Medicine Mapping with Categories
export const diseaseMedicineMapping: Record<string, { medicines: string[]; category: string }> = {
  // Pain & Fever Related
  "fever": { medicines: ["Crocin (Paracetamol)", "Dolo 650 (Paracetamol)", "Combiflam (Ibuprofen+Paracetamol)"], category: "Pain & Fever" },
  "headache": { medicines: ["Crocin (Paracetamol)", "Disprin (Aspirin)", "Saridon (Paracetamol+Caffeine)", "Combiflam (Ibuprofen+Paracetamol)"], category: "Pain & Fever" },
  "migraine": { medicines: ["Saridon (Paracetamol+Caffeine)", "Brufen (Ibuprofen)", "Sumo (Nimesulide+Paracetamol)"], category: "Pain & Fever" },
  "body pain": { medicines: ["Combiflam (Ibuprofen+Paracetamol)", "Brufen (Ibuprofen)", "Voveran (Diclofenac)"], category: "Pain & Fever" },
  "toothache": { medicines: ["Brufen (Ibuprofen)", "Nise (Nimesulide)", "Combiflam (Ibuprofen+Paracetamol)"], category: "Pain & Fever" },
  "arthritis": { medicines: ["Voveran (Diclofenac)", "Nise (Nimesulide)", "Brufen (Ibuprofen)"], category: "Pain & Fever" },
  
  // Cough & Cold Related
  "cold": { medicines: ["Sinarest (Cold Relief)", "Vicks VapoRub", "Cetirizine (Anti-allergy)", "Benadryl Syrup (Cough)"], category: "Cough & Cold" },
  "cough": { medicines: ["Benadryl Syrup (Cough)", "Grilinctus Syrup", "Chericof Syrup", "Honitus Syrup"], category: "Cough & Cold" },
  "flu": { medicines: ["Sinarest (Cold Relief)", "Crocin (Paracetamol)", "Benadryl Syrup (Cough)", "Vicks VapoRub"], category: "Cough & Cold" },
  "allergy": { medicines: ["Cetirizine (Anti-allergy)", "Allegra (Fexofenadine)", "Montair LC (Montelukast)"], category: "Cough & Cold" },
  "sinus": { medicines: ["Otrivin Nasal Spray", "Sinarest (Cold Relief)", "Allegra (Fexofenadine)"], category: "Cough & Cold" },
  "asthma": { medicines: ["Asthalin Inhaler", "Levolin Inhaler", "Montair LC (Montelukast)"], category: "Cough & Cold" },
  "bronchitis": { medicines: ["Asthalin Inhaler", "Benadryl Syrup (Cough)", "Azithromycin (Azee)"], category: "Cough & Cold" },
  "nasal congestion": { medicines: ["Otrivin Nasal Spray", "Sinarest (Cold Relief)", "Vicks VapoRub"], category: "Cough & Cold" },
  
  // Digestive & Gastric Related
  "acidity": { medicines: ["Digene (Antacid)", "Gelusil MPS (Antacid)", "Eno (Antacid)", "Pan D (Pantoprazole)"], category: "Digestive & Gastric" },
  "indigestion": { medicines: ["Digene (Antacid)", "Eno (Antacid)", "Pan D (Pantoprazole)"], category: "Digestive & Gastric" },
  "gastric": { medicines: ["Pan D (Pantoprazole)", "Omez (Omeprazole)", "Ranitidine"], category: "Digestive & Gastric" },
  "ulcer": { medicines: ["Omez (Omeprazole)", "Pan D (Pantoprazole)", "Ranitidine"], category: "Digestive & Gastric" },
  "constipation": { medicines: ["Dulcolax (Laxative)", "Cremaffin (Laxative)"], category: "Digestive & Gastric" },
  "diarrhea": { medicines: ["Imodium (Anti-diarrheal)", "ORS Electral", "Econorm (Probiotic)", "Enterogermina (Probiotic)"], category: "Digestive & Gastric" },
  "food poisoning": { medicines: ["Norflox TZ (Antibiotic)", "ORS Electral", "Econorm (Probiotic)"], category: "Digestive & Gastric" },
  "stomach infection": { medicines: ["Norflox TZ (Antibiotic)", "Metronidazole (Flagyl)", "Enterogermina (Probiotic)"], category: "Digestive & Gastric" },
  "nausea": { medicines: ["Eno (Antacid)", "Digene (Antacid)", "Pan D (Pantoprazole)"], category: "Digestive & Gastric" },
  "vomiting": { medicines: ["ORS Electral", "Econorm (Probiotic)", "Eno (Antacid)"], category: "Digestive & Gastric" },
  
  // Skin Related
  "wound": { medicines: ["Betadine (Antiseptic)", "Soframycin (Antibiotic Cream)", "Dettol Antiseptic"], category: "Skin Care" },
  "fungal infection": { medicines: ["Candid B (Antifungal)", "Betadine (Antiseptic)"], category: "Skin Care" },
  "skin rash": { medicines: ["Clobetasol Cream", "Lacto Calamine Lotion", "Candid B (Antifungal)"], category: "Skin Care" },
  "acne": { medicines: ["Himalaya Neem Face Wash", "Lacto Calamine Lotion"], category: "Skin Care" },
  "sunburn": { medicines: ["Neutrogena Sunscreen", "Lacto Calamine Lotion", "Boroline (Antiseptic Cream)"], category: "Skin Care" },
  "dry skin": { medicines: ["Boroline (Antiseptic Cream)", "Lacto Calamine Lotion", "Dermadew Soap"], category: "Skin Care" },
  
  // Eye & Ear Related
  "eye infection": { medicines: ["Ciprofloxacin Eye Drops", "Moxifloxacin Eye Drops", "Ciplox D Eye Drops"], category: "Eye & Ear Care" },
  "dry eyes": { medicines: ["Tears Naturale (Eye Lubricant)"], category: "Eye & Ear Care" },
  "ear infection": { medicines: ["Otorex Ear Drops"], category: "Eye & Ear Care" },
  "conjunctivitis": { medicines: ["Ciprofloxacin Eye Drops", "Moxifloxacin Eye Drops"], category: "Eye & Ear Care" },
  
  // Infections
  "bacterial infection": { medicines: ["Amoxicillin", "Azithromycin (Azee)", "Ciprofloxacin", "Augmentin (Amox+Clav)"], category: "Antibiotics" },
  "throat infection": { medicines: ["Azithromycin (Azee)", "Amoxicillin", "Cefixime (Zifi)"], category: "Antibiotics" },
  "urinary tract infection": { medicines: ["Ciprofloxacin", "Ofloxacin", "Norflox TZ (Antibiotic)"], category: "Antibiotics" },
  "typhoid": { medicines: ["Ciprofloxacin", "Ofloxacin", "Cefixime (Zifi)"], category: "Antibiotics" },
  "dental infection": { medicines: ["Amoxicillin", "Metronidazole (Flagyl)", "Augmentin (Amox+Clav)"], category: "Antibiotics" },
  
  // Diabetes Related
  "diabetes": { medicines: ["Metformin", "Glimepiride", "Glucometer Strips"], category: "Diabetes Care" },
  "high blood sugar": { medicines: ["Metformin", "Glimepiride"], category: "Diabetes Care" },
  
  // Cardiac & BP Related
  "high blood pressure": { medicines: ["Amlodipine", "Atenolol", "Telmisartan"], category: "Cardiac & BP" },
  "hypertension": { medicines: ["Amlodipine", "Telmisartan", "Atenolol"], category: "Cardiac & BP" },
  "heart disease": { medicines: ["Aspirin 75mg (Ecosprin)", "Atorvastatin", "Clopidogrel"], category: "Cardiac & BP" },
  "cholesterol": { medicines: ["Atorvastatin"], category: "Cardiac & BP" },
  
  // Women's Health
  "menstrual cramps": { medicines: ["Meftal Spas (Mefenamic)", "Cyclopam (Antispasmodic)"], category: "Women's Health" },
  "period pain": { medicines: ["Meftal Spas (Mefenamic)", "Cyclopam (Antispasmodic)", "Combiflam (Ibuprofen+Paracetamol)"], category: "Women's Health" },
  "pregnancy supplements": { medicines: ["Folvite (Folic Acid)", "Livogen (Iron+Folic Acid)", "Shelcal (Calcium+D3)"], category: "Women's Health" },
  
  // Muscle & Joint
  "muscle pain": { medicines: ["Volini Gel", "Moov Spray", "Iodex Balm", "Flexon MR (Muscle Relaxant)"], category: "Muscle & Joint" },
  "back pain": { medicines: ["Volini Gel", "Moov Spray", "Flexon MR (Muscle Relaxant)", "Thiocolchicoside"], category: "Muscle & Joint" },
  "joint pain": { medicines: ["Volini Gel", "Iodex Balm", "Voveran (Diclofenac)"], category: "Muscle & Joint" },
  "sprain": { medicines: ["Volini Gel", "Moov Spray", "Combiflam (Ibuprofen+Paracetamol)"], category: "Muscle & Joint" },
  
  // Deficiencies & Supplements
  "vitamin deficiency": { medicines: ["Becosules (B-Complex)", "Supradyn (Multivitamin)", "Zincovit (Zinc+Vitamins)", "Revital (Multivitamin)"], category: "Vitamins & Supplements" },
  "anemia": { medicines: ["Livogen (Iron+Folic Acid)", "Folvite (Folic Acid)"], category: "Vitamins & Supplements" },
  "calcium deficiency": { medicines: ["Shelcal (Calcium+D3)", "Calcimax P (Calcium)"], category: "Vitamins & Supplements" },
  "weakness": { medicines: ["Becosules (B-Complex)", "Revital (Multivitamin)", "Supradyn (Multivitamin)", "A to Z NS (Multivitamin)"], category: "Vitamins & Supplements" },
  "immunity boost": { medicines: ["Limcee (Vitamin C)", "Zincovit (Zinc+Vitamins)", "Supradyn (Multivitamin)"], category: "Vitamins & Supplements" },
  
  // Mental Health & Sleep
  "insomnia": { medicines: ["Melatonin"], category: "Mental Health & Sleep" },
  "anxiety": { medicines: ["Alprazolam", "Clonazepam"], category: "Mental Health & Sleep" },
  "sleep disorder": { medicines: ["Melatonin", "Alprazolam"], category: "Mental Health & Sleep" },
  
  // Dehydration
  "dehydration": { medicines: ["Electral (ORS)", "ORS Electral"], category: "First Aid" },
};

// Get all disease names for search
export const getAllDiseases = (): string[] => {
  return Object.keys(diseaseMedicineMapping);
};

// Search diseases by query
export const searchDiseases = (query: string): string[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return Object.keys(diseaseMedicineMapping).filter(disease => 
    disease.toLowerCase().includes(lowerQuery)
  );
};

// Get medicines for a disease
export const getMedicinesForDisease = (disease: string): { medicines: string[]; category: string } | null => {
  return diseaseMedicineMapping[disease.toLowerCase()] || null;
};

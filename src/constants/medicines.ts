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

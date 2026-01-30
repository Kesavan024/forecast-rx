-- Create table for historical medicine sales data
CREATE TABLE public.medicine_sales_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine TEXT NOT NULL,
  category TEXT NOT NULL,
  sale_date DATE NOT NULL,
  units_sold INTEGER NOT NULL,
  revenue NUMERIC(10,2) NOT NULL,
  weather_condition TEXT DEFAULT 'Normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.medicine_sales_history ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (historical data is reference data)
CREATE POLICY "Historical sales data is publicly readable" 
ON public.medicine_sales_history 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_medicine_sales_date ON public.medicine_sales_history(sale_date);
CREATE INDEX idx_medicine_sales_medicine ON public.medicine_sales_history(medicine);
CREATE INDEX idx_medicine_sales_category ON public.medicine_sales_history(category);
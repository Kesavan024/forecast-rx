
-- Restrict medicine_sales_history to authenticated users only
DROP POLICY "Historical sales data is publicly readable" ON public.medicine_sales_history;

CREATE POLICY "Authenticated users can view historical sales data"
  ON public.medicine_sales_history
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

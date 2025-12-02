-- Add prediction_period column to forecasts table
ALTER TABLE public.forecasts 
ADD COLUMN prediction_period text;

-- Add a comment to describe the column
COMMENT ON COLUMN public.forecasts.prediction_period IS 'Stores the time period/range for the forecast (e.g., Current Month, Next 12 Months, specific date ranges)';
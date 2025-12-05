-- Add INSERT policy for profiles (defense in depth, even though trigger handles creation)
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add DELETE policy for profiles (GDPR compliance - users can delete their data)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Add UPDATE policy for forecasts (allow users to modify their forecasts)
CREATE POLICY "Users can update their own forecasts" 
ON public.forecasts 
FOR UPDATE 
USING (auth.uid() = user_id);
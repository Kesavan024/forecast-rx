import { Activity } from "lucide-react";
import WeatherForecast from "@/components/WeatherForecast";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediCast Analytics</h1>
              <p className="text-xs text-muted-foreground">Weather-Based Medicine Sales Forecasting</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Sales Forecasting Dashboard
          </h2>
          <p className="text-muted-foreground">
            Predict medicine demand based on weather conditions with advanced analytics
          </p>
        </div>

        <WeatherForecast />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/40 bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 MediCast Analytics. Powered by advanced predictive algorithms.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

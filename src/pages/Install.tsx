import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Smartphone, Check, Share, Monitor, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsDesktop(!isMobile);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Listen for app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Install App</h1>
              <p className="text-xs text-muted-foreground">Add MediCast to your device</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* App Preview */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-card shadow-lg flex items-center justify-center">
                {isDesktop ? (
                  <Monitor className="h-12 w-12 text-primary" />
                ) : (
                  <Smartphone className="h-12 w-12 text-primary" />
                )}
              </div>
            </div>
            <CardHeader className="text-center">
              <CardTitle>MediCast Analytics</CardTitle>
              <CardDescription>
                Weather-Based Medicine Sales Forecasting
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Installation Status */}
          {isInstalled ? (
            <Card className="border-green-500/50 bg-green-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">App Installed!</h3>
                    <p className="text-sm text-muted-foreground">
                      MediCast is now installed on your {isDesktop ? "computer" : "home screen"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : deferredPrompt ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Install App
                </CardTitle>
                <CardDescription>
                  Add MediCast to your {isDesktop ? "desktop" : "home screen"} for quick access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleInstall} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Install MediCast
                </Button>
              </CardContent>
            </Card>
          ) : isDesktop ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5" />
                  Install on PC / Laptop
                </CardTitle>
                <CardDescription>
                  Follow these steps to install MediCast as a desktop app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">For Chrome / Edge:</p>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Look for the <strong>install icon</strong> (⊕) in the address bar, or click the <strong>menu</strong> (three dots)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select <strong>"Install MediCast Analytics"</strong> or <strong>"Install app"</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click <strong>"Install"</strong> to confirm. The app will open in its own window!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isIOS ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  Install on iPhone/iPad
                </CardTitle>
                <CardDescription>
                  Follow these steps to add MediCast to your home screen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tap the <strong>Share</strong> button in Safari (the square with an arrow)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scroll down and tap <strong>"Add to Home Screen"</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tap <strong>"Add"</strong> to confirm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Install on Android
                </CardTitle>
                <CardDescription>
                  Follow these steps to add MediCast to your home screen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tap the <strong>menu</strong> button (three dots) in Chrome
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tap <strong>"Install"</strong> to confirm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why Install?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  {isDesktop ? "Quick access from your desktop or Start menu" : "Quick access from your home screen"}
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  Works offline for viewing saved forecasts
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  {isDesktop ? "Runs in its own window without browser tabs" : "Full-screen experience without browser UI"}
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  Faster loading after first install
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Install;
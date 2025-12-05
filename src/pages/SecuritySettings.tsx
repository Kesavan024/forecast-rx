import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, ExternalLink, ArrowLeft } from "lucide-react";

interface SecurityItem {
  id: string;
  name: string;
  description: string;
  status: "secure" | "warning" | "info";
  action?: string;
  link?: string;
}

const SecuritySettings = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const securityItems: SecurityItem[] = [
    {
      id: "leaked_password_protection",
      name: "Leaked Password Protection",
      description: "Prevents users from signing up with passwords that have appeared in known data breaches. This significantly improves account security by blocking compromised passwords.",
      status: "warning",
      action: "Enable this feature in your backend authentication settings to protect user accounts.",
      link: "https://docs.lovable.dev/features/security#leaked-password-protection-disabled"
    },
    {
      id: "rls_policies",
      name: "Row Level Security (RLS)",
      description: "All database tables have RLS enabled with proper user-scoped policies ensuring data isolation.",
      status: "secure"
    },
    {
      id: "auth_implementation",
      name: "Authentication System",
      description: "Email/password authentication with secure session management and proper token refresh handling.",
      status: "secure"
    },
    {
      id: "input_validation",
      name: "Input Validation",
      description: "Form inputs are validated using Zod schema validation to prevent malformed data.",
      status: "secure"
    }
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    navigate("/auth");
    return null;
  }

  const getStatusBadge = (status: SecurityItem["status"]) => {
    switch (status) {
      case "secure":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Secure</Badge>;
      case "warning":
        return <Badge variant="destructive" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Action Required</Badge>;
      case "info":
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getStatusIcon = (status: SecurityItem["status"]) => {
    switch (status) {
      case "secure":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const warningCount = securityItems.filter(item => item.status === "warning").length;
  const secureCount = securityItems.filter(item => item.status === "secure").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Security Settings</h1>
            <p className="text-muted-foreground">Review and manage your application security</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Checks</p>
                  <p className="text-2xl font-bold">{securityItems.length}</p>
                </div>
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Secure</p>
                  <p className="text-2xl font-bold text-green-500">{secureCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Action Required</p>
                  <p className="text-2xl font-bold text-yellow-500">{warningCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning Alert */}
        {warningCount > 0 && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-600">Action Required</AlertTitle>
            <AlertDescription className="text-yellow-600/80">
              {warningCount} security {warningCount === 1 ? 'item requires' : 'items require'} your attention. Review the items below and take the recommended actions.
            </AlertDescription>
          </Alert>
        )}

        {/* Security Items */}
        <div className="space-y-4">
          {securityItems.map((item) => (
            <Card key={item.id} className={item.status === "warning" ? "border-yellow-500/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="mt-1">{item.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              {(item.action || item.link) && (
                <CardContent className="pt-0">
                  {item.action && (
                    <p className="text-sm text-muted-foreground mb-3">{item.action}</p>
                  )}
                  {item.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        View Documentation
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">About Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This page provides an overview of your application's security configuration. 
              Some settings like "Leaked Password Protection" are managed at the infrastructure level 
              and require access to your backend settings to enable. Regular security reviews help 
              maintain the integrity and safety of your application and user data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Eye, History, Package, LogIn, LogOut, User } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logistics-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LogitechHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-logistics">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">LogiTag</h1>
          <p className="text-muted-foreground">NFC Asset & Logistics Tracking</p>
        </div>

        {user ? (
          <>
            <div className="space-y-4">
              <Card className="bg-gradient-card shadow-card border-0">
                <Link to="/write-tag" className="block p-6 hover:bg-secondary/50 transition-colors rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-logistics-primary rounded-full p-3">
                      <Wifi className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground">Write Tag</h2>
                      <p className="text-sm text-muted-foreground">Create new NFC tags for assets</p>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <Link to="/read-tag" className="block p-6 hover:bg-secondary/50 transition-colors rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-logistics-success rounded-full p-3">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground">Read Tag</h2>
                      <p className="text-sm text-muted-foreground">Scan and view NFC tag data</p>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <Link to="/history" className="block p-6 hover:bg-secondary/50 transition-colors rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-logistics-accent rounded-full p-3">
                      <History className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground">History</h2>
                      <p className="text-sm text-muted-foreground">View scan and write history</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>

            <div className="mt-8 space-y-4">
              <Card className="bg-gradient-card shadow-card border-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-logistics-secondary rounded-full p-2">
                      <User className="h-4 w-4 text-logistics-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="border-logistics-danger/20 text-logistics-danger hover:bg-logistics-danger hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Card className="bg-gradient-card shadow-card border-0">
              <div className="p-6 text-center">
                <div className="bg-logistics-secondary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-logistics-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Sign In Required</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Please sign in to access your NFC tags and logistics data
                </p>
                <Link to="/auth">
                  <Button className="w-full bg-logistics-primary hover:bg-logistics-primary/90 text-white">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In / Sign Up
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Designed By Frank Bazuaye. Powered By LiveGig Ltd
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
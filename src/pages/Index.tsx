import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Eye, History, Package } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";

const Index = () => {
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

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Ready to scan? Ensure NFC is enabled on your device.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
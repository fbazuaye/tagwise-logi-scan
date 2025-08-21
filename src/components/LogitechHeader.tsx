import { Package2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LogitechHeader = () => {
  return (
    <header className="bg-white shadow-card border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-md">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary rounded-lg p-2">
            <Package2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">LogiTag</h1>
            <p className="text-xs text-muted-foreground">NFC Asset Tracker</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};
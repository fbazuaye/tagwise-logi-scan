import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Wifi, AlertCircle, CheckCircle } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";
import { useToast } from "@/hooks/use-toast";

const WriteTag = () => {
  const [formData, setFormData] = useState({
    assetId: "",
    shipmentId: "",
    containerId: "",
    description: "",
    location: ""
  });
  const [isWriting, setIsWriting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWriteTag = async () => {
    if (!formData.assetId && !formData.shipmentId && !formData.containerId) {
      toast({
        title: "Missing Information",
        description: "Please provide at least one ID (Asset, Shipment, or Container)",
        variant: "destructive"
      });
      return;
    }

    setIsWriting(true);
    
    // Simulate NFC writing process
    setTimeout(() => {
      setIsWriting(false);
      toast({
        title: "Tag Written Successfully",
        description: "NFC tag has been programmed with asset data",
      });
      
      // Reset form
      setFormData({
        assetId: "",
        shipmentId: "",
        containerId: "",
        description: "",
        location: ""
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <LogitechHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Write NFC Tag</h1>
        </div>

        <Card className="bg-gradient-card shadow-card border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-logistics-primary" />
              <span>Asset Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="assetId">Asset ID</Label>
              <Input
                id="assetId"
                placeholder="e.g., AST-001234"
                value={formData.assetId}
                onChange={(e) => handleInputChange("assetId", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="shipmentId">Shipment ID</Label>
              <Input
                id="shipmentId"
                placeholder="e.g., SHP-567890"
                value={formData.shipmentId}
                onChange={(e) => handleInputChange("shipmentId", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="containerId">Container ID</Label>
              <Input
                id="containerId"
                placeholder="e.g., CONT-789012"
                value={formData.containerId}
                onChange={(e) => handleInputChange("containerId", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Asset description or notes..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                placeholder="e.g., Warehouse A, Bay 5"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-logistics-secondary/30 border-logistics-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-logistics-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Ready to write NFC tag</p>
                <p className="text-muted-foreground">
                  Hold your NFC tag close to the device when you tap "Write Tag" below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleWriteTag}
          disabled={isWriting}
          className="w-full bg-logistics-primary hover:bg-logistics-primary/90 text-white shadow-logistics"
        >
          {isWriting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Writing Tag...
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 mr-2" />
              Write Tag
            </>
          )}
        </Button>
      </main>
    </div>
  );
};

export default WriteTag;
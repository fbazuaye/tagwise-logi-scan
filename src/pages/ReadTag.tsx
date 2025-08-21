import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Wifi, RefreshCw, Database } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";
import { useToast } from "@/hooks/use-toast";

interface TagData {
  uid: string;
  assetId: string;
  shipmentId: string;
  containerId: string;
  description: string;
  location: string;
  timestamp: string;
  tagType: string;
  memorySize: string;
}

const ReadTag = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [tagData, setTagData] = useState<TagData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleScanTag = async () => {
    setIsScanning(true);
    
    // Simulate NFC reading process
    setTimeout(() => {
      setIsScanning(false);
      const mockData: TagData = {
        uid: "04:A3:2F:12:B8:7C:80",
        assetId: "AST-001234",
        shipmentId: "SHP-567890",
        containerId: "CONT-789012",
        description: "Industrial Equipment - Compressor Unit",
        location: "Warehouse A, Bay 5",
        timestamp: new Date().toLocaleString(),
        tagType: "NTAG213",
        memorySize: "180 bytes"
      };
      
      setTagData(mockData);
      toast({
        title: "Tag Read Successfully",
        description: "NFC tag data has been retrieved",
      });
    }, 2000);
  };

  const handleSyncToSupabase = async () => {
    if (!tagData) return;
    
    setIsSyncing(true);
    
    // Simulate sync to Supabase
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Synced to Database",
        description: "Tag data has been saved to Supabase",
      });
    }, 1500);
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
          <h1 className="text-2xl font-bold text-foreground">Read NFC Tag</h1>
        </div>

        {!tagData ? (
          <Card className="bg-gradient-card shadow-card border-0 mb-6">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Eye className="h-6 w-6 text-logistics-success" />
                <span>Scan NFC Tag</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-logistics-secondary/50 rounded-full w-32 h-32 mx-auto flex items-center justify-center">
                <Wifi className={`h-16 w-16 text-logistics-primary ${isScanning ? 'animate-pulse' : ''}`} />
              </div>
              
              <div>
                <p className="text-muted-foreground mb-4">
                  {isScanning ? 'Hold tag near device...' : 'Tap the button below and hold an NFC tag close to your device.'}
                </p>
                
                <Button 
                  onClick={handleScanTag}
                  disabled={isScanning}
                  className="w-full bg-logistics-success hover:bg-logistics-success/90 text-white"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-logistics-success">
                  <Wifi className="h-5 w-5" />
                  <span>Tag Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">UID</p>
                    <p className="font-mono text-xs">{tagData.uid}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Type</p>
                    <p className="text-foreground">{tagData.tagType}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Memory</p>
                    <p className="text-foreground">{tagData.memorySize}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Read Time</p>
                    <p className="text-foreground text-xs">{tagData.timestamp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Asset Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tagData.assetId && (
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Asset ID</p>
                    <p className="text-foreground">{tagData.assetId}</p>
                  </div>
                )}
                
                {tagData.shipmentId && (
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Shipment ID</p>
                    <p className="text-foreground">{tagData.shipmentId}</p>
                  </div>
                )}
                
                {tagData.containerId && (
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Container ID</p>
                    <p className="text-foreground">{tagData.containerId}</p>
                  </div>
                )}
                
                {tagData.description && (
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Description</p>
                    <p className="text-foreground">{tagData.description}</p>
                  </div>
                )}
                
                {tagData.location && (
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Location</p>
                    <p className="text-foreground">{tagData.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button 
                onClick={handleSyncToSupabase}
                disabled={isSyncing}
                className="flex-1 bg-logistics-primary hover:bg-logistics-primary/90 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Sync to DB
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => setTagData(null)}
                variant="outline"
                className="border-logistics-primary text-logistics-primary hover:bg-logistics-primary/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Scan Again
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadTag;
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Wifi, RefreshCw, Database } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to read NFC tags",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      setUser(user);
    };

    checkUser();
  }, [navigate, toast]);

  const handleScanTag = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to read NFC tags",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);

    try {
      // In a real NFC app, you'd get the tag UID from the NFC hardware
      // For demo, we'll simulate reading the most recent tag
      const { data: recentTag, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!recentTag) {
        toast({
          title: "No Tags Found",
          description: "No NFC tags found in database. Write a tag first.",
          variant: "destructive"
        });
        setIsScanning(false);
        return;
      }

      // Update last_scanned timestamp
      await supabase
        .from('tags')
        .update({ last_scanned: new Date().toISOString() })
        .eq('id', recentTag.id);

      // Log the read operation
      await supabase
        .from('nfc_logs')
        .insert({
          tag_uid: recentTag.tag_uid,
          action_type: 'read',
          data: recentTag.written_data,
          user_id: user.id
        });

      // Format data for display
      const writtenData = recentTag.written_data as any;
      const formattedData: TagData = {
        uid: recentTag.tag_uid,
        assetId: writtenData?.assetId || '',
        shipmentId: writtenData?.shipmentId || '',
        containerId: writtenData?.containerId || '',
        description: writtenData?.description || '',
        location: writtenData?.location || '',
        timestamp: new Date(recentTag.last_scanned || recentTag.created_at).toLocaleString(),
        tagType: "MIFARE Classic 1K",
        memorySize: "1024 bytes"
      };

      setTagData(formattedData);
      
      toast({
        title: "Tag Read Successfully",
        description: `NFC tag ${recentTag.tag_uid} data retrieved`,
      });

    } catch (error) {
      console.error('Error reading tag:', error);
      toast({
        title: "Read Failed",
        description: "Failed to read NFC tag. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
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
                onClick={() => setTagData(null)}
                className="flex-1 bg-logistics-primary hover:bg-logistics-primary/90 text-white"
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
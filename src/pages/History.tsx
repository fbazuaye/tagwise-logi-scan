import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Wifi, Eye, Edit } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";


const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view history",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (user) {
      fetchHistory(user.id);
    }
  }, [user, authLoading, navigate, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logistics-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fetchHistory = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nfc_logs')
        .select(`
          id,
          tag_uid,
          action_type,
          data,
          created_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setHistoryData(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error Loading History",
        description: "Failed to load NFC operation history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = historyData.filter(item => 
    item.data?.assetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data?.shipmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data?.containerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tag_uid?.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
          <h1 className="text-2xl font-bold text-foreground">History</h1>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Asset ID, Shipment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logistics-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading history...</p>
              </CardContent>
            </Card>
          ) : filteredHistory.length === 0 ? (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6 text-center">
                <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No matching records found" : "No NFC operations recorded yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Write or read some NFC tags to see them here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="bg-gradient-card shadow-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {item.action_type === "write" ? (
                        <Edit className="h-4 w-4 text-logistics-primary" />
                      ) : (
                        <Eye className="h-4 w-4 text-secondary" />
                      )}
                      <Badge 
                        variant={item.action_type === "write" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.action_type === "write" ? "WRITE" : "READ"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()} {" "}
                      {new Date(item.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tag UID:</span>
                      <span className="font-mono text-xs">{item.tag_uid}</span>
                    </div>
                    
                    {item.data?.assetId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Asset ID:</span>
                        <span className="font-semibold text-logistics-primary">{item.data.assetId}</span>
                      </div>
                    )}
                    
                    {item.data?.shipmentId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipment ID:</span>
                        <span className="font-semibold">{item.data.shipmentId}</span>
                      </div>
                    )}
                    
                    {item.data?.containerId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Container ID:</span>
                        <span className="font-semibold">{item.data.containerId}</span>
                      </div>
                    )}
                    
                    {item.data?.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{item.data.location}</span>
                      </div>
                    )}

                    {item.data?.description && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Description:</span>
                        <span className="text-right max-w-48 truncate">{item.data.description}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
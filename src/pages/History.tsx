import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Wifi, Eye, Calendar, Filter } from "lucide-react";
import { LogitechHeader } from "@/components/LogitechHeader";

interface HistoryItem {
  id: string;
  type: 'write' | 'read';
  assetId: string;
  shipmentId?: string;
  containerId?: string;
  description: string;
  timestamp: string;
  location?: string;
  tagUid: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'read',
    assetId: 'AST-001234',
    shipmentId: 'SHP-567890',
    containerId: 'CONT-789012',
    description: 'Industrial Equipment - Compressor Unit',
    timestamp: '2024-01-15 14:30:25',
    location: 'Warehouse A, Bay 5',
    tagUid: '04:A3:2F:12:B8:7C:80'
  },
  {
    id: '2',
    type: 'write',
    assetId: 'AST-002345',
    shipmentId: 'SHP-678901',
    description: 'Medical Supplies - Emergency Kit',
    timestamp: '2024-01-15 13:15:10',
    location: 'Warehouse B, Section 2',
    tagUid: '04:B4:3G:23:C9:8D:91'
  },
  {
    id: '3',
    type: 'read',
    assetId: 'AST-003456',
    containerId: 'CONT-890123',
    description: 'Electronic Components - Sensors',
    timestamp: '2024-01-15 11:45:55',
    location: 'Distribution Center',
    tagUid: '04:C5:4H:34:DA:9E:A2'
  },
  {
    id: '4',
    type: 'write',
    assetId: 'AST-004567',
    shipmentId: 'SHP-789012',
    description: 'Safety Equipment - Hard Hats',
    timestamp: '2024-01-14 16:20:30',
    location: 'Warehouse C, Zone 1',
    tagUid: '04:D6:5I:45:EB:AF:B3'
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'read' | 'write'>('all');

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = 
      item.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.shipmentId && item.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.containerId && item.containerId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (type: 'write' | 'read') => {
    return type === 'write' ? 
      <Wifi className="h-4 w-4 text-logistics-primary" /> : 
      <Eye className="h-4 w-4 text-logistics-success" />;
  };

  const getActionColor = (type: 'write' | 'read') => {
    return type === 'write' ? 'bg-logistics-primary/10 border-logistics-primary/20' : 'bg-logistics-success/10 border-logistics-success/20';
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

          <div className="flex space-x-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-logistics-primary hover:bg-logistics-primary/90' : ''}
            >
              All
            </Button>
            <Button
              variant={filterType === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('read')}
              className={filterType === 'read' ? 'bg-logistics-success hover:bg-logistics-success/90' : ''}
            >
              <Eye className="h-3 w-3 mr-1" />
              Reads
            </Button>
            <Button
              variant={filterType === 'write' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('write')}
              className={filterType === 'write' ? 'bg-logistics-primary hover:bg-logistics-primary/90' : ''}
            >
              <Wifi className="h-3 w-3 mr-1" />
              Writes
            </Button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="pt-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No history items found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Start scanning tags to see history'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className={`border ${getActionColor(item.type)} bg-gradient-card shadow-card`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(item.type)}
                      <span className="font-medium text-sm capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.timestamp}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{item.assetId}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      {item.shipmentId && (
                        <span className="bg-logistics-secondary px-2 py-1 rounded">
                          {item.shipmentId}
                        </span>
                      )}
                      {item.containerId && (
                        <span className="bg-logistics-secondary px-2 py-1 rounded">
                          {item.containerId}
                        </span>
                      )}
                    </div>
                    
                    {item.location && (
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                    )}
                    
                    <p className="text-xs text-muted-foreground font-mono">UID: {item.tagUid}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
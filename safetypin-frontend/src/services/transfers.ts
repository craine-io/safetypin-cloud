// Transfer service implementation
import api from './api';

// Types
export interface Transfer {
  id: string;
  serverId: string;
  serverName: string;
  filename: string;
  path: string;
  direction: 'upload' | 'download';
  timestamp: string;
  size: string;
  sizeBytes: number;
  status: 'completed' | 'failed' | 'in-progress';
}

export interface TransferStats {
  totalCount: number;
  uploadCount: number;
  downloadCount: number;
  totalSizeBytes: number;
  uploadSizeBytes: number;
  downloadSizeBytes: number;
}

// Mock transfer data
const mockTransfers: Transfer[] = [
  {
    id: "tr-001",
    serverId: "srv-001",
    serverName: "Production Server",
    filename: "quarterly-report.pdf",
    path: "/uploads/quarterly-report.pdf",
    direction: "upload",
    timestamp: "10 minutes ago",
    size: "4.2 MB",
    sizeBytes: 4404019,
    status: "completed"
  },
  {
    id: "tr-002",
    serverId: "srv-002",
    serverName: "Development Server",
    filename: "client-data.csv",
    path: "/downloads/client-data.csv",
    direction: "download",
    timestamp: "25 minutes ago",
    size: "1.8 MB",
    sizeBytes: 1887436,
    status: "completed"
  },
  {
    id: "tr-003",
    serverId: "srv-004",
    serverName: "Backup Server",
    filename: "system-backup.zip",
    path: "/uploads/system-backup.zip",
    direction: "upload",
    timestamp: "1 hour ago",
    size: "256.4 MB",
    sizeBytes: 268881920,
    status: "completed"
  },
  {
    id: "tr-004",
    serverId: "srv-001",
    serverName: "Production Server",
    filename: "user-profiles.json",
    path: "/downloads/user-profiles.json",
    direction: "download",
    timestamp: "3 hours ago",
    size: "782 KB",
    sizeBytes: 800768,
    status: "completed"
  },
  {
    id: "tr-005",
    serverId: "srv-001",
    serverName: "Production Server",
    filename: "large-dataset.zip",
    path: "/uploads/large-dataset.zip",
    direction: "upload",
    timestamp: "Just now",
    size: "1.2 GB",
    sizeBytes: 1288490188,
    status: "in-progress"
  }
];

class TransferService {
  // Get all transfers
  async getTransfers(): Promise<Transfer[]> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      return Promise.resolve([...mockTransfers]);
    }
    
    // Otherwise, call the real API
    return api.get<Transfer[]>('/transfers');
  }
  
  // Get transfers for a specific server
  async getServerTransfers(serverId: string): Promise<Transfer[]> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      return Promise.resolve(
        mockTransfers.filter(t => t.serverId === serverId)
      );
    }
    
    // Otherwise, call the real API
    return api.get<Transfer[]>(`/servers/${serverId}/transfers`);
  }
  
  // Calculate transfer statistics
  async getTransferStats(serverId?: string): Promise<TransferStats> {
    // Get the relevant transfers
    const transfers = serverId ? 
      await this.getServerTransfers(serverId) : 
      await this.getTransfers();
    
    // Calculate statistics
    const stats: TransferStats = {
      totalCount: transfers.length,
      uploadCount: transfers.filter(t => t.direction === 'upload').length,
      downloadCount: transfers.filter(t => t.direction === 'download').length,
      totalSizeBytes: transfers.reduce((sum, t) => sum + t.sizeBytes, 0),
      uploadSizeBytes: transfers
        .filter(t => t.direction === 'upload')
        .reduce((sum, t) => sum + t.sizeBytes, 0),
      downloadSizeBytes: transfers
        .filter(t => t.direction === 'download')
        .reduce((sum, t) => sum + t.sizeBytes, 0)
    };
    
    return stats;
  }
}

// Export singleton instance
export const transferService = new TransferService();
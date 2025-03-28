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
    id: 'tr-001',
    serverId: 'srv-001',
    serverName: 'Production Server',
    filename: 'quarterly-report.pdf',
    path: '/uploads/quarterly-report.pdf',
    direction: 'upload',
    timestamp: '10 minutes ago',
    size: '4.2 MB',
    sizeBytes: 4404019,
    status: 'completed',
  },
  {
    id: 'tr-002',
    serverId: 'srv-002',
    serverName: 'Development Server',
    filename: 'client-data.csv',
    path: '/downloads/client-data.csv',
    direction: 'download',
    timestamp: '25 minutes ago',
    size: '1.8 MB',
    sizeBytes: 1887436,
    status: 'completed',
  },
  {
    id: 'tr-003',
    serverId: 'srv-004',
    serverName: 'Backup Server',
    filename: 'system-backup.zip',
    path: '/uploads/system-backup.zip',
    direction: 'upload',
    timestamp: '1 hour ago',
    size: '256.4 MB',
    sizeBytes: 268881920,
    status: 'completed',
  },
  {
    id: 'tr-004',
    serverId: 'srv-001',
    serverName: 'Production Server',
    filename: 'user-profiles.json',
    path: '/downloads/user-profiles.json',
    direction: 'download',
    timestamp: '3 hours ago',
    size: '782 KB',
    sizeBytes: 800768,
    status: 'completed',
  },
  {
    id: 'tr-005',
    serverId: 'srv-001',
    serverName: 'Production Server',
    filename: 'large-dataset.zip',
    path: '/uploads/large-dataset.zip',
    direction: 'upload',
    timestamp: 'Just now',
    size: '1.2 GB',
    sizeBytes: 1288490188,
    status: 'in-progress',
  },
];

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: string | Date): string => {
  if (typeof timestamp === 'string') return timestamp;

  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

// Helper function to map API transfer to frontend transfer
const mapApiTransferToTransfer = (apiTransfer: any, serverName?: string): Transfer => {
  return {
    id: apiTransfer.id,
    serverId: apiTransfer.serverId,
    serverName: serverName || apiTransfer.serverName || 'Unknown Server',
    filename: apiTransfer.filename,
    path: apiTransfer.path,
    direction: apiTransfer.direction,
    timestamp: formatTimestamp(apiTransfer.timestamp),
    size: formatFileSize(apiTransfer.size),
    sizeBytes: parseInt(apiTransfer.size, 10),
    status: apiTransfer.status,
  };
};

class TransferService {
  // Get all transfers
  async getTransfers(): Promise<Transfer[]> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      return Promise.resolve([...mockTransfers]);
    }

    // Call the real API
    try {
      const transfersData = await api.get<any[]>('/transfers');

      // Map API response to frontend model
      const transfers = await Promise.all(
        transfersData.map(async transfer => {
          // Try to get server name
          let serverName = 'Unknown Server';
          try {
            const server = await api.get<any>(`/servers/${transfer.server_id}`);
            serverName = server.name;
          } catch (error) {
            console.warn(`Could not fetch server name for server ${transfer.server_id}`);
          }

          return mapApiTransferToTransfer(transfer, serverName);
        })
      );

      return transfers;
    } catch (error) {
      console.error('Error fetching transfers:', error);
      // Fall back to mock data if the API fails
      return [...mockTransfers];
    }
  }

  // Get transfers for a specific server
  async getServerTransfers(serverId: string): Promise<Transfer[]> {
    // Use mock data if in mock mode
    if (api.shouldUseMockData()) {
      return Promise.resolve(mockTransfers.filter(t => t.serverId === serverId));
    }

    // Call the real API
    try {
      const transfersData = await api.get<any[]>(`/servers/${serverId}/transfers`);

      // Try to get server name
      let serverName = 'Unknown Server';
      try {
        const server = await api.get<any>(`/servers/${serverId}`);
        serverName = server.name;
      } catch (error) {
        console.warn(`Could not fetch server name for server ${serverId}`);
      }

      // Map API response to frontend model
      const transfers = transfersData.map(transfer =>
        mapApiTransferToTransfer(transfer, serverName)
      );

      return transfers;
    } catch (error) {
      console.error(`Error fetching transfers for server ${serverId}:`, error);
      // Fall back to mock data if the API fails
      return mockTransfers.filter(t => t.serverId === serverId);
    }
  }

  // Calculate transfer statistics
  async getTransferStats(serverId?: string): Promise<TransferStats> {
    if (api.shouldUseMockData()) {
      // Get the relevant transfers
      const transfers = serverId
        ? await this.getServerTransfers(serverId)
        : await this.getTransfers();

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
          .reduce((sum, t) => sum + t.sizeBytes, 0),
      };

      return stats;
    }

    // Call the real API
    try {
      // Build query parameters
      const queryParams = serverId ? `?serverId=${serverId}` : '';

      // Get statistics directly from the API
      const stats = await api.get<TransferStats>(`/transfer-stats${queryParams}`);
      return stats;
    } catch (error) {
      console.error('Error fetching transfer statistics:', error);

      // Fall back to calculating from transfers if the API fails
      const transfers = serverId
        ? await this.getServerTransfers(serverId)
        : await this.getTransfers();

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
          .reduce((sum, t) => sum + t.sizeBytes, 0),
      };

      return stats;
    }
  }
}

// Export singleton instance
export const transferService = new TransferService();

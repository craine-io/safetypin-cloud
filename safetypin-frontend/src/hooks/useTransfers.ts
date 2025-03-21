// Transfers hook for React components
import { useState, useEffect, useCallback } from 'react';
import { transferService, Transfer, TransferStats } from '../services/transfers';

export function useTransfers(serverId?: string) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [stats, setStats] = useState<TransferStats>({
    totalCount: 0,
    uploadCount: 0,
    downloadCount: 0,
    totalSizeBytes: 0,
    uploadSizeBytes: 0,
    downloadSizeBytes: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch transfers - either all transfers or for a specific server
  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data: Transfer[];
      
      if (serverId) {
        data = await transferService.getServerTransfers(serverId);
      } else {
        data = await transferService.getTransfers();
      }
      
      setTransfers(data);
      
      // Get transfer stats
      const transferStats = await transferService.getTransferStats(serverId);
      setStats(transferStats);
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError('Failed to fetch transfers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  // Load transfers on initial render and when serverId changes
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers, serverId]);

  return {
    transfers,
    stats,
    loading,
    error,
    fetchTransfers,
  };
}

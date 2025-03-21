// Server hook for React components
import { useState, useEffect, useCallback } from 'react';
import { serverService, Server, ServerCreationParams, ServerProvisionResult } from '../services/servers';

export function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all servers
  const fetchServers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await serverService.getServers();
      setServers(data);
    } catch (err) {
      console.error('Error fetching servers:', err);
      setError('Failed to fetch servers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific server
  const fetchServer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      return await serverService.getServer(id);
    } catch (err) {
      console.error(`Error fetching server ${id}:`, err);
      setError('Failed to fetch server details. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new server
  const createServer = useCallback(async (params: ServerCreationParams): Promise<ServerProvisionResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await serverService.createServer(params);
      
      // Update the server list
      fetchServers();
      
      return result;
    } catch (err) {
      console.error('Error creating server:', err);
      setError('Failed to create server. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchServers]);

  // Delete a server
  const deleteServer = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await serverService.deleteServer(id);
      
      // Update the server list
      fetchServers();
      return true;
    } catch (err) {
      console.error(`Error deleting server ${id}:`, err);
      setError('Failed to delete server. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServers]);

  // Load servers on initial render
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  return {
    servers,
    loading,
    error,
    fetchServers,
    fetchServer,
    createServer,
    deleteServer,
  };
}

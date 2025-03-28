import { Request, Response } from 'express';
import { RepositoryFactory } from '../lib/repositories';
import { CreateServerDto, UpdateServerDto } from '../models/servers/server.model';

// Get the server repository
const serverRepository = RepositoryFactory.getServerRepository();

/**
 * Controller for handling server-related endpoints
 */
export class ServerController {
  /**
   * Get all servers
   */
  async getAllServers(req: Request, res: Response): Promise<void> {
    try {
      // Get query parameters
      const organizationId = req.query.organizationId as string;
      const status = req.query.status as string;
      const region = req.query.region as string;
      
      // Build filter
      const filter: Record<string, any> = {};
      if (organizationId) filter.organization_id = organizationId;
      if (status) filter.status = status;
      if (region) filter.region = region;
      
      // Get servers
      const servers = await serverRepository.findAll(filter);
      
      res.status(200).json(servers);
    } catch (error) {
      console.error('Error getting servers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get a server by ID
   */
  async getServerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Get server
      const server = await serverRepository.findById(id);
      
      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }
      
      res.status(200).json(server);
    } catch (error) {
      console.error(`Error getting server ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Create a new server
   */
  async createServer(req: Request, res: Response): Promise<void> {
    try {
      const createServerDto = req.body as CreateServerDto;
      
      // Validate required fields
      if (!createServerDto.name || !createServerDto.region || !createServerDto.storageSize) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      
      // Create server
      const server = await serverRepository.create(createServerDto);
      
      // Generate SSH key if needed
      let privateKey: string | undefined;
      if (createServerDto.securityOptions?.sshKeyType === 'generate') {
        // In a real implementation, this would generate an actual SSH key pair
        const mockPublicKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0SLhpJ7I8sftp-example-key';
        privateKey = '-----BEGIN RSA PRIVATE KEY-----\nMockPrivateKey\n-----END RSA PRIVATE KEY-----';
        
        // Store credentials
        await serverRepository.storeCredentials(server.id, mockPublicKey, privateKey);
      }
      
      // Return server with credentials
      const credentials = {
        host: server.host,
        port: 22, // Default SFTP port
        username: server.username,
        privateKey: privateKey
      };
      
      res.status(201).json({ server, credentials });
    } catch (error) {
      console.error('Error creating server:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Update a server
   */
  async updateServer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateServerDto = req.body as UpdateServerDto;
      
      // Update server
      const server = await serverRepository.update(id, updateServerDto);
      
      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }
      
      res.status(200).json(server);
    } catch (error) {
      console.error(`Error updating server ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Delete a server
   */
  async deleteServer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Delete server
      const deleted = await serverRepository.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting server ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Update server status
   */
  async updateServerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Validate status
      if (!status || !['Online', 'Offline', 'Maintenance', 'Provisioning'].includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }
      
      // Update status
      const server = await serverRepository.updateStatus(id, status);
      
      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }
      
      res.status(200).json(server);
    } catch (error) {
      console.error(`Error updating server status ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get servers by organization
   */
  async getServersByOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      
      // Get servers
      const servers = await serverRepository.findByOrganization(organizationId);
      
      res.status(200).json(servers);
    } catch (error) {
      console.error(`Error getting servers for organization ${req.params.organizationId}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Export a singleton instance
export const serverController = new ServerController();

import { Request, Response } from 'express';
import { RepositoryFactory } from '../lib/repositories';
import { CreateTransferDto, UpdateTransferDto } from '../models/servers/transfers.model';

// Get the transfer repository
const transferRepository = RepositoryFactory.getTransferRepository();
const serverRepository = RepositoryFactory.getServerRepository();

/**
 * Controller for handling transfer-related endpoints
 */
export class TransferController {
  /**
   * Get all transfers
   */
  async getAllTransfers(req: Request, res: Response): Promise<void> {
    try {
      // Get query parameters
      const serverId = req.query.serverId as string;
      const organizationId = req.query.organizationId as string;
      const direction = req.query.direction as string;
      const status = req.query.status as string;
      const limitStr = req.query.limit as string;
      const limit = limitStr ? parseInt(limitStr, 10) : undefined;
      
      // Build filter
      const filter: Record<string, any> = {};
      if (serverId) filter.server_id = serverId;
      if (organizationId) filter.organization_id = organizationId;
      if (direction) filter.direction = direction;
      if (status) filter.status = status;
      
      // Get transfers
      let transfers;
      if (limit && Object.keys(filter).length === 0) {
        // If only limit is specified, get recent transfers
        transfers = await transferRepository.findRecentTransfers(limit);
      } else {
        // Otherwise, use standard find with filter
        transfers = await transferRepository.findAll(filter, { 
          limit,
          orderBy: 'timestamp',
          orderDirection: 'desc'
        });
      }
      
      res.status(200).json(transfers);
    } catch (error) {
      console.error('Error getting transfers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get a transfer by ID
   */
  async getTransferById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Get transfer
      const transfer = await transferRepository.findById(id);
      
      if (!transfer) {
        res.status(404).json({ error: 'Transfer not found' });
        return;
      }
      
      res.status(200).json(transfer);
    } catch (error) {
      console.error(`Error getting transfer ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Create a new transfer
   */
  async createTransfer(req: Request, res: Response): Promise<void> {
    try {
      const createTransferDto = req.body as CreateTransferDto;
      
      // Validate required fields
      if (!createTransferDto.serverId || !createTransferDto.filename || 
          !createTransferDto.path || !createTransferDto.direction || 
          !createTransferDto.size) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      
      // Verify the server exists
      const server = await serverRepository.findById(createTransferDto.serverId);
      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }
      
      // If organizationId not provided, use the server's organization
      if (!createTransferDto.organizationId) {
        createTransferDto.organizationId = server.organizationId;
      }
      
      // Create transfer
      const transfer = await transferRepository.create(createTransferDto);
      
      // Update server storage used
      if (createTransferDto.direction === 'upload' && server.status === 'Online') {
        await serverRepository.updateStorageUsed(server.id, 
          Math.min(server.storageUsed + createTransferDto.size, server.storageLimit));
      }
      
      res.status(201).json(transfer);
    } catch (error) {
      console.error('Error creating transfer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Update a transfer
   */
  async updateTransfer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateTransferDto = req.body as UpdateTransferDto;
      
      // Update transfer
      const transfer = await transferRepository.update(id, updateTransferDto);
      
      if (!transfer) {
        res.status(404).json({ error: 'Transfer not found' });
        return;
      }
      
      res.status(200).json(transfer);
    } catch (error) {
      console.error(`Error updating transfer ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Update transfer status
   */
  async updateTransferStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, errorDetails } = req.body;
      
      // Validate status
      if (!status || !['completed', 'failed', 'in-progress'].includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }
      
      // Update status
      const transfer = await transferRepository.updateTransferStatus(id, status, errorDetails);
      
      if (!transfer) {
        res.status(404).json({ error: 'Transfer not found' });
        return;
      }
      
      res.status(200).json(transfer);
    } catch (error) {
      console.error(`Error updating transfer status ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get transfers by server
   */
  async getTransfersByServer(req: Request, res: Response): Promise<void> {
    try {
      const { serverId } = req.params;
      
      // Get transfers
      const transfers = await transferRepository.findByServer(serverId);
      
      res.status(200).json(transfers);
    } catch (error) {
      console.error(`Error getting transfers for server ${req.params.serverId}:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get transfer statistics
   */
  async getTransferStats(req: Request, res: Response): Promise<void> {
    try {
      const serverId = req.query.serverId as string;
      const organizationId = req.query.organizationId as string;
      
      // Get statistics
      const stats = await transferRepository.getTransferStats(serverId, organizationId);
      
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error getting transfer statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Export a singleton instance
export const transferController = new TransferController();

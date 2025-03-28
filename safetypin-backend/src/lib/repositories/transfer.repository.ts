import { BaseRepository } from './base.repository';
import { 
  Transfer, 
  CreateTransferDto, 
  UpdateTransferDto,
  TransferStats
} from '../../models/servers/transfers.model';

export interface TransferRepository extends BaseRepository<Transfer, CreateTransferDto, UpdateTransferDto> {
  // Find by server
  findByServer(serverId: string): Promise<Transfer[]>;
  
  // Find by organization
  findByOrganization(organizationId: string): Promise<Transfer[]>;
  
  // Find by user
  findByUser(userId: string): Promise<Transfer[]>;
  
  // Find by filename/path
  findByPath(path: string, serverId?: string): Promise<Transfer[]>;
  
  // Get transfer statistics
  getTransferStats(serverId?: string, organizationId?: string): Promise<TransferStats>;
  
  // Get stats by time period
  getTransferStatsByPeriod(
    startDate: Date,
    endDate: Date,
    serverId?: string,
    organizationId?: string
  ): Promise<TransferStats>;
  
  // Update transfer status
  updateTransferStatus(id: string, status: 'completed' | 'failed' | 'in-progress', errorDetails?: string): Promise<Transfer | null>;
  
  // Find recent transfers
  findRecentTransfers(limit?: number, serverId?: string, organizationId?: string): Promise<Transfer[]>;
  
  // Get transfer count by direction
  getTransferCountByDirection(
    direction: 'upload' | 'download',
    serverId?: string,
    organizationId?: string
  ): Promise<number>;
}

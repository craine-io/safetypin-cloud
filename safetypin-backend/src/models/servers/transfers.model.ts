// Transfer model definitions

export interface Transfer {
  id: string;
  serverId: string;
  organizationId: string;
  filename: string;
  path: string;
  direction: 'upload' | 'download';
  timestamp: Date;
  size: number;
  status: 'completed' | 'failed' | 'in-progress';
  userId?: string;
  clientIp?: string;
  transferTime?: number; // in seconds
  checksumBefore?: string;
  checksumAfter?: string;
  errorDetails?: string;
}

export interface CreateTransferDto {
  serverId: string;
  organizationId: string;
  filename: string;
  path: string;
  direction: 'upload' | 'download';
  size: number;
  userId?: string;
  clientIp?: string;
}

export interface UpdateTransferDto {
  status?: 'completed' | 'failed' | 'in-progress';
  transferTime?: number;
  checksumAfter?: string;
  errorDetails?: string;
}

export interface TransferStats {
  totalCount: number;
  uploadCount: number;
  downloadCount: number;
  totalSizeBytes: number;
  uploadSizeBytes: number;
  downloadSizeBytes: number;
}

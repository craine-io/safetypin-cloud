// Transfer types definitions

export interface FileTransfer {
  id: string;
  serverId: string;
  filename: string;
  path: string;
  direction: 'upload' | 'download';
  timestamp: string;
  size: string;
  sizeBytes: number;
  status: 'Completed' | 'Failed' | 'In Progress';
  userId: string;
  ipAddress?: string;
  errorMessage?: string;
}

export interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size?: string;
  sizeBytes?: number;
  lastModified?: string;
  permissions?: string;
  path: string;
}

export interface TransferStats {
  totalUploads: number;
  totalDownloads: number;
  totalTransferred: string;
  totalTransferredBytes: number;
  failedTransfers: number;
  activeTransfers: number;
}

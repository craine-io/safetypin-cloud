// Base repository interface for common CRUD operations

export interface BaseRepository<T, CreateDto, UpdateDto> {
  // Find operations
  findById(id: string): Promise<T | null>;
  findAll(filter?: any, options?: QueryOptions): Promise<T[]>;
  findOne(filter: any): Promise<T | null>;
  count(filter?: any): Promise<number>;
  
  // Create operations
  create(dto: CreateDto): Promise<T>;
  createMany(dtos: CreateDto[]): Promise<T[]>;
  
  // Update operations
  update(id: string, dto: UpdateDto): Promise<T | null>;
  updateMany(filter: any, dto: Partial<UpdateDto>): Promise<number>;
  
  // Delete operations
  delete(id: string): Promise<boolean>;
  deleteMany(filter: any): Promise<number>;
  
  // Utility operations
  exists(filter: any): Promise<boolean>;
  transaction<R>(callback: (repository: BaseRepository<T, CreateDto, UpdateDto>) => Promise<R>): Promise<R>;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  include?: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export function getPaginatedResult<T>(
  items: T[],
  total: number,
  limit: number,
  offset: number
): PaginatedResult<T> {
  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + items.length < total,
  };
}

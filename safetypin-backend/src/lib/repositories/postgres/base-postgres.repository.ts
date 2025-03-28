import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { BaseRepository, QueryOptions } from '../base.repository';
import { query, transaction } from '../../database/config';

export abstract class BasePostgresRepository<T, RowType, CreateDto, UpdateDto> implements BaseRepository<T, CreateDto, UpdateDto> {
  protected tableName: string;
  protected idField: string = 'id';
  
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  protected abstract mapToEntity(row: RowType): T;
  protected abstract mapToCreateQuery(dto: CreateDto): { query: string; params: any[] };
  protected abstract mapToUpdateQuery(dto: UpdateDto): { setClause: string; params: any[] };
  
  // Find operations
  async findById(id: string): Promise<T | null> {
    const result = await query(
      `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
      [id]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as RowType) : null;
  }
  
  async findAll(filter: any = {}, options: QueryOptions = {}): Promise<T[]> {
    const { whereClause, params } = this.buildWhereClause(filter);
    const limitClause = options.limit ? `LIMIT ${options.limit}` : '';
    const offsetClause = options.offset ? `OFFSET ${options.offset}` : '';
    const orderClause = options.orderBy 
      ? `ORDER BY ${options.orderBy} ${options.orderDirection || 'asc'}`
      : '';
    
    const result = await query(
      `SELECT * FROM ${this.tableName}
       ${whereClause}
       ${orderClause}
       ${limitClause}
       ${offsetClause}`,
      params
    );
    
    return result.rows.map((row: RowType) => this.mapToEntity(row));
  }
  
  async findOne(filter: any): Promise<T | null> {
    const { whereClause, params } = this.buildWhereClause(filter);
    
    const result = await query(
      `SELECT * FROM ${this.tableName}
       ${whereClause}
       LIMIT 1`,
      params
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as RowType) : null;
  }
  
  async count(filter: any = {}): Promise<number> {
    const { whereClause, params } = this.buildWhereClause(filter);
    
    const result = await query(
      `SELECT COUNT(*) as count FROM ${this.tableName}
       ${whereClause}`,
      params
    );
    
    return parseInt(result.rows[0].count, 10);
  }
  
  // Create operations
  async create(dto: CreateDto): Promise<T> {
    const { query: createQuery, params } = this.mapToCreateQuery(dto);
    
    const result = await query(createQuery, params);
    
    return this.mapToEntity(result.rows[0] as RowType);
  }
  
  async createMany(dtos: CreateDto[]): Promise<T[]> {
    return await transaction(async (client) => {
      const results: T[] = [];
      
      for (const dto of dtos) {
        const { query: createQuery, params } = this.mapToCreateQuery(dto);
        const result = await client.query(createQuery, params);
        results.push(this.mapToEntity(result.rows[0] as RowType));
      }
      
      return results;
    });
  }
  
  // Update operations
  async update(id: string, dto: UpdateDto): Promise<T | null> {
    const { setClause, params } = this.mapToUpdateQuery(dto);
    
    if (!setClause) {
      // No fields to update
      return this.findById(id);
    }
    
    const result = await query(
      `UPDATE ${this.tableName}
       SET ${setClause}, last_update_time = CURRENT_TIMESTAMP
       WHERE ${this.idField} = $${params.length + 1}
       RETURNING *`,
      [...params, id]
    );
    
    return result.rows.length > 0 ? this.mapToEntity(result.rows[0] as RowType) : null;
  }
  
  async updateMany(filter: any, dto: Partial<UpdateDto>): Promise<number> {
    const { whereClause, params: whereParams } = this.buildWhereClause(filter);
    const { setClause, params: updateParams } = this.mapToUpdateQuery(dto as UpdateDto);
    
    if (!setClause) {
      // No fields to update
      return 0;
    }
    
    const result = await query(
      `UPDATE ${this.tableName}
       SET ${setClause}, last_update_time = CURRENT_TIMESTAMP
       ${whereClause}`,
      [...updateParams, ...whereParams]
    );
    
    return result.rowCount;
  }
  
  // Delete operations
  async delete(id: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.tableName} WHERE ${this.idField} = $1`,
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  async deleteMany(filter: any): Promise<number> {
    const { whereClause, params } = this.buildWhereClause(filter);
    
    const result = await query(
      `DELETE FROM ${this.tableName} ${whereClause}`,
      params
    );
    
    return result.rowCount;
  }
  
  // Utility operations
  async exists(filter: any): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }
  
  async transaction<R>(callback: (repository: BaseRepository<T, CreateDto, UpdateDto>) => Promise<R>): Promise<R> {
    return await transaction(async (client) => {
      const transactionRepo = this.getTransactionRepository(client);
      return await callback(transactionRepo);
    });
  }
  
  protected abstract getTransactionRepository(client: PoolClient): BaseRepository<T, CreateDto, UpdateDto>;
  
  // Helper methods
  protected buildWhereClause(filter: any): { whereClause: string; params: any[] } {
    if (!filter || Object.keys(filter).length === 0) {
      return { whereClause: '', params: [] };
    }
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    Object.entries(filter).forEach(([key, value], index) => {
      if (value === null) {
        conditions.push(`${key} IS NULL`);
      } else if (Array.isArray(value)) {
        params.push(value);
        conditions.push(`${key} = ANY($${params.length})`);
      } else if (typeof value === 'object' && value !== null) {
        // Handle operators like $gt, $lt, etc.
        Object.entries(value).forEach(([op, opValue]) => {
          params.push(opValue);
          switch (op) {
            case '$gt':
              conditions.push(`${key} > $${params.length}`);
              break;
            case '$lt':
              conditions.push(`${key} < $${params.length}`);
              break;
            case '$gte':
              conditions.push(`${key} >= $${params.length}`);
              break;
            case '$lte':
              conditions.push(`${key} <= $${params.length}`);
              break;
            case '$ne':
              conditions.push(`${key} != $${params.length}`);
              break;
            case '$like':
              conditions.push(`${key} LIKE $${params.length}`);
              break;
            case '$ilike':
              conditions.push(`${key} ILIKE $${params.length}`);
              break;
            default:
              // Ignore unknown operators
              break;
          }
        });
      } else {
        params.push(value);
        conditions.push(`${key} = $${params.length}`);
      }
    });
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    return { whereClause, params };
  }
  
  protected generateId(): string {
    return uuidv4();
  }
}

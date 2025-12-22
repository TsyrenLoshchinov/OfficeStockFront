export interface WarehouseItem {
  id: number;
  productId: number;
  name: string;
  category: string;
  estimatedConsumptionDate: string | null;
  quantity: number;
  writeOffQuantity?: number;
}

// API Response interface
export interface WarehouseItemApiResponse {
  id: number;
  product_id: number;
  product_name: string;
  category_name: string;
  rest: string;
  last_update: string;
}

// Write-off Schedule API interfaces
export interface WriteOffScheduleRead {
  id: number;
  product_id: number;
  interval_days: number;
  quantity_per_writeoff: number;
  is_active: boolean;
  last_writeoff_date: string | null;
  date_create: string;
}

export interface WriteOffScheduleCreate {
  product_id: number;
  interval_days: number;
  quantity_per_writeoff: number;
}

export interface WriteOffScheduleUpdate {
  interval_days?: number;
  quantity_per_writeoff?: number;
  is_active?: boolean;
}

// Frontend display interface for write-off rules
export interface WriteOffRule {
  id: number;
  productId: number;
  productName: string;
  intervalDays: number;
  quantityPerWriteoff: number;
  isActive: boolean;
  lastWriteoffDate: string | null;
  dateCreate: string;
}

export interface CreateWriteOffRulePayload {
  productId: number;
  intervalDays: number;
  quantityPerWriteoff: number;
}

export interface UpdateWriteOffRulePayload {
  intervalDays?: number;
  quantityPerWriteoff?: number;
  isActive?: boolean;
}


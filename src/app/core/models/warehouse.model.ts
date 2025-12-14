export interface WarehouseItem {
  id: number;
  name: string;
  category: string;
  estimatedConsumptionDate: string | null; // null если недостаточно данных
  quantity: number;
  writeOffQuantity?: number; // Количество для списания
}

// API Response interface
export interface WarehouseItemApiResponse {
  id: number;
  product_id: number;
  product_name: string;
  category_name: string;
  rest: string; // Строка с числом
  last_update: string;
}

export interface WriteOffRule {
  id: number;
  itemId: number;
  itemName: string;
  frequency: number; // Периодичность в днях
  frequencyUnit: 'days' | 'weeks' | 'months';
}

export interface CreateWriteOffRulePayload {
  itemId: number;
  frequency: number;
  frequencyUnit: 'days' | 'weeks' | 'months';
}


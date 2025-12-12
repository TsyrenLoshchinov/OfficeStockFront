export interface Order {
  id: string;
  requester: string;
  status: 'draft' | 'submitted' | 'approved' | 'shipped';
  total: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}


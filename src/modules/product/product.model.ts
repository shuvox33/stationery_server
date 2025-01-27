export type IProduct = {
  name: string;
  brand: string;
  price: number;
  category:
    | 'Writing'
    | 'Office Supplies'
    | 'Art Supplies'
    | 'Educational'
    | 'Technology';
  model: string;
  description?: string;
  quantity: number;
  inStock: boolean;
  image?: string;
};

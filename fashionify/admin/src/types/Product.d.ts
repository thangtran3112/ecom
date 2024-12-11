export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
}

interface ProductOrderItem extends IProduct {
  size: string;
  quantity: number;
}

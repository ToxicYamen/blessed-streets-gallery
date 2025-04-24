
export type ProductColor = 'black' | 'khaki';
export type ProductSize = 'M' | 'L' | 'XL';

export interface ProductInventory {
  size: ProductSize;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  color: ProductColor;
  images: string[];
  sizes: ProductSize[];
  inventory: ProductInventory[];
  featured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}

export type ProductCollection = {
  [key: string]: Product;
};

export const products: ProductCollection = {
  "black-hoodie": {
    id: "black-hoodie",
    name: "Blesssed Streets Logo Hoodie",
    price: 99.99,
    description: "Premium black hoodie featuring the iconic Blesssed Streets logo embroidery. Made from high-quality cotton for ultimate comfort and style.",
    color: "black",
    images: [
      "/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png",
      "/lovable-uploads/623e99f8-cf2a-460c-acae-13d2d7081dec.png",
      "/lovable-uploads/28893163-9864-483e-aa41-5c9c5f70b41c.png"
    ],
    sizes: ["M", "L", "XL"],
    inventory: [
      { size: "M", quantity: 15 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 10 }
    ],
    featured: true,
    isNew: true
  },
  "khaki-hoodie": {
    id: "khaki-hoodie",
    name: "Blesssed Streets Logo Hoodie",
    price: 99.99,
    description: "Premium khaki hoodie featuring the iconic Blesssed Streets logo embroidery. Made from high-quality cotton for ultimate comfort and style.",
    color: "khaki",
    images: [
      "/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png",
      "/lovable-uploads/14cc0786-37aa-4471-8f05-f800b6420083.png",
      "/lovable-uploads/bc7f81ea-fb32-4ff2-915a-b8a677272b83.png",
      "/lovable-uploads/4db1a544-1a50-475b-80dd-36804b583257.png"
    ],
    sizes: ["M", "L", "XL"],
    inventory: [
      { size: "M", quantity: 19 },
      { size: "L", quantity: 21 },
      { size: "XL", quantity: 9 }
    ],
    featured: true,
    isNew: true
  }
};

export const getFeaturedProducts = (): Product[] => {
  return Object.values(products).filter(product => product.featured);
};

export const getNewArrivals = (): Product[] => {
  return Object.values(products).filter(product => product.isNew);
};

export const getSaleProducts = (): Product[] => {
  return Object.values(products).filter(product => product.isSale);
};

export const getAllProducts = (): Product[] => {
  return Object.values(products);
};

export const getProductById = (id: string): Product | undefined => {
  return products[id];
};

export const getRelatedProducts = (currentProductId: string, limit: number = 4): Product[] => {
  return Object.values(products)
    .filter(product => product.id !== currentProductId)
    .slice(0, limit);
};

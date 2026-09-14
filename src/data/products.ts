import snapshot from './source-details.json';
export const categories = ['Sneakers','Hoodies','T-Shirts','Jackets','Accessories','Bags','Pants','Watches','Shorts','Knitwear'];
export type Product = {id:string;name:string;category:string;priceCny:number;sourceUrl:string;sourceCategoryUrl:string;imageUrl:string;batch:string|null;qcUrl:string|null;w2cUrl:string;qcPhotos:string[];checkedAt:string};
export const products: Product[] = snapshot;

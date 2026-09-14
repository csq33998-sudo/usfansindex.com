// Source index snapshot: 2026-09-14. Categories are editorial mappings.
export const categories = ['Sneakers','Hoodies','T-Shirts','Jackets','Accessories','Bags','Pants','Watches','Shorts','Knitwear'];
export type Product = {id:string;name:string;category:string;priceCny:number;sourceUrl:string;batch:string|null;qcUrl:string|null;w2cUrl:string|null};
import details from './source-details.json';
const sourceProducts:Product[] = [
{id:'a8bff7',name:'Supreme x Louis Vuitton Epi Leather Wallet Black',category:'Accessories',priceCny:36,sourceUrl:'https://streetstyle.maisonlooks.com/en/p/louis-vuitton-supreme-x-louis-vuitton-epi-leather-wallet-black-a8bff7',batch:null,qcUrl:null,w2cUrl:null},
{id:'cdf05d',name:'Canada Goose Expedition Black Parka',category:'Jackets',priceCny:150,sourceUrl:'https://streetstyle.maisonlooks.com/en/p/canada-goose-expedition-black-parka-cdf05d',batch:null,qcUrl:null,w2cUrl:null},
{id:'9ff998',name:'Balenciaga Beige Hoodie with BALEN CIAGA Print',category:'Hoodies',priceCny:196,sourceUrl:'https://streetstyle.maisonlooks.com/en/p/balenciaga-beige-hoodie-with-balen-ciaga-print-9ff998',batch:null,qcUrl:null,w2cUrl:null},
{id:'33c2d4',name:'Asics Gel-Nimbus 14 Silver/Blue Sneakers',category:'Sneakers',priceCny:248,sourceUrl:'https://streetstyle.maisonlooks.com/en/p/asics-gel-nimbus-14-silver-blue-sneakers-33c2d4',batch:null,qcUrl:null,w2cUrl:null},
{id:'1bcf42',name:'Hellstar Neon Green Star Flame T-Shirt',category:'T-Shirts',priceCny:119,sourceUrl:'https://streetstyle.maisonlooks.com/en/p/hellstar-neon-green-star-flame-t-shirt-1bcf42',batch:null,qcUrl:null,w2cUrl:null}
];
export const products = sourceProducts.map(p => { const detail = details.find(d => d.id === p.id)!; return {...p,...detail,qcUrl:detail.qcPhotos[0] || null}; });

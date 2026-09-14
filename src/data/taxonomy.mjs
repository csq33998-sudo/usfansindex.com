// Source category slugs are preserved on products; these groups organize navigation.
export const categoryDefinitions = [
 {slug:'shoes',name:'Shoes',sources:['sneakers','boots','sandals-slippers','loafers-flats','heels'],description:'Sneakers, boots, sandals and everyday shoes.'},
 {slug:'hoodies-sweaters',name:'Hoodies / Sweaters',sources:['hoodies-sweatshirts','sweaters-knits'],description:'Hoodies, sweatshirts, knits and cardigans.'},
 {slug:'t-shirts',name:'T-Shirts',sources:['t-shirts','tank-tops'],description:'Graphic tees, everyday T-shirts and tanks.'},
 {slug:'jackets',name:'Jackets',sources:['jackets','parkas-down-jackets','coats','blazers','outerwear'],description:'Light jackets, coats, blazers and winter layers.'},
 {slug:'pants-shorts',name:'Pants / Shorts',sources:['trousers-pants','jeans','shorts','skirts','leggings','bottoms'],description:'Trousers, denim, shorts and other bottoms.'},
 {slug:'headwear',name:'Headwear',sources:['headwear'],description:'Caps, beanies and hats.'},
 {slug:'sets',name:'Sets',sources:['tracksuits','coord-sets','suits','sets-suits'],description:'Matching sets, tracksuits and suits.'},
 {slug:'underwear',name:'Underwear / Swim',sources:['underwear-swim'],description:'Underwear, swimwear and base layers.'},
 {slug:'jerseys',name:'Jerseys',sources:['jerseys'],description:'Sports jerseys and team shirts.'},
 {slug:'accessories',name:'Accessories',sources:['eyewear','belts','jewelry-watches','socks-hosiery','scarves-ties','accessory-others','accessories'],description:'Eyewear, jewelry, watches, belts and finishing touches.'},
 {slug:'bags',name:'Bags',sources:['bags-backpacks'],description:'Bags, backpacks, wallets and small leather goods.'},
 {slug:'clothing',name:'Shirts / Dresses',sources:['shirts-blouses','polo-shirts','formal-dresses','casual-dresses','jumpsuits-rompers','dresses-one-piece','tops','clothing'],description:'Shirts, blouses, dresses and one-piece outfits.'},
 {slug:'beauty',name:'Beauty / Fragrance',sources:['perfume','beauty-fragrance'],description:'Perfume and beauty finds from the source directory.'},
 {slug:'electronics',name:'Electronics',sources:['audio','phone-accessories','wearables','personal-care-devices','electronics'],description:'Audio, phone accessories, wearables and personal devices.'},
 {slug:'other',name:'Other Finds',sources:[],description:'Items whose source category is missing or outside the main groups.'},
];
export function categoryFor(item){
 const source=item.primaryCategory?.slug;
 if(!source){
  const title=item.title;
  if(/\b(?:track\s?suit|co-?ord|set)\b/i.test(title))return 'sets';
  if(/\bjerseys?\b/i.test(title))return 'jerseys';
  if(/\bt-shirts?\b/i.test(title))return 't-shirts';
  if(/\b(?:shorts|pants|jeans|trousers|skirt)\b/i.test(title))return 'pants-shorts';
  if(/\b(?:hoodie|sweatshirt|sweater|cardigan)\b/i.test(title))return 'hoodies-sweaters';
  if(/\b(?:sunglasses|eyewear|glasses)\b/i.test(title))return 'accessories';
 }
 if(['t-shirts','shirts-blouses','tank-tops'].includes(source)&&/\bjerseys?\b/i.test(item.title))return 'jerseys';
 if(source==='shirts-blouses'&&/\b(?:t[- ]?shirts?|tees?)\b/i.test(item.title))return 't-shirts';
 if(source==='jewelry-watches'&&/\b(?:wallet|cardholder|card holder|handbag|backpack|crossbody|tote bag)\b/i.test(item.title))return 'bags';
 return categoryDefinitions.find(c=>c.sources.includes(source))?.slug||'other';
}
export const legacyCategories={sneakers:'shoes',hoodies:'hoodies-sweaters',pants:'pants-shorts',shorts:'pants-shorts',knitwear:'hoodies-sweaters',watches:'accessories',denim:'pants-shorts'};

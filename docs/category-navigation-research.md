# Categories 导航调研与实现

参考站：[USFans Shipping](https://usfansshipping.net/)。产品来源：[Street Style / MaisonLooks](https://streetstyle.maisonlooks.com/)。调研日期：2026-09-14。

## 实际查看的参考分类

通过外部 Chrome 展开 Categories，并逐一打开全部 10 个分类落地页。参考站菜单是平铺下拉菜单，分类链接实际指向 repsw2c.com。落地页使用图片卡片、商品名称、人民币及美元估价、搜索和数字分页。

| 菜单分类 | 实际落地页 | 所查看页面的商品图片数 |
| --- | --- | ---: |
| Shoes | [Shoes](https://repsw2c.com/category-911-Shoes.html) | 100 |
| Hoodies/Sweaters | [Hoodies/Sweaters](https://repsw2c.com/search-912/name/Shoes.html) | 100 |
| T-Shirts | [T-Shirts](https://repsw2c.com/search-913/name/Shoes.html) | 100 |
| Jackets | [Jackets](https://repsw2c.com/search-914/name/Shoes.html) | 100 |
| Pants/Shorts | [Pants/Shorts](https://repsw2c.com/search-915/name/Shoes.html) | 100 |
| Headwear | [Headwear](https://repsw2c.com/search-916/name/Shoes.html) | 100 |
| Sets | [Sets](https://repsw2c.com/search-917/name/Shoes.html) | 100 |
| Underwear/Underpants | [Underwear/Underpants](https://repsw2c.com/search-918/name/Shoes.html) | 69 |
| Jersey | [Jersey](https://repsw2c.com/search-919/name/Shoes.html) | 100 |
| Accessories | [Accessories](https://repsw2c.com/search-920/name/Shoes.html) | 100 |

这些是查看页面的图片数量，不代表各类商品总量。原始浏览记录保存在本地 `output/category-research/reference.json`。

## 本站实现

- 延续本站浅绿色、深绿文字和紧凑字体；菜单按两列展示，附商品数量。点击外部、移出焦点和 Esc 均收起。
- 保留参考站服饰大类，增加源站实际存在的包袋、衬衫/连衣裙、美妆/香水和电子产品。
- 桌面分类侧栏、手机可折叠分类列表；商品以图片卡片展示，每页 48 件。
- 每个分类及其分页都有独立 HTML 和 canonical，加入站点地图，网址无片段符号。
- 搜索覆盖当前完整分类，支持源站细分类筛选和价格排序，查询与页码保存在网址中。
- 源站分类缺失时，仅对名称明确的商品作规则分类。球衣从源站上衣类中按名称分出；衬衫类中明确标为 T-shirt/Tee 的商品归入 T-Shirts，首饰类中明确的钱包等归入 Bags。源站原分类仍保存在商品字段中。
- 商品使用真实图片地址、名称、价格和源站详情链接。保留此前已核验的 W2C 及 QC；未核验原始购买地址的商品打开源站详情，不猜测平台或链接。
- 多语言沿用已有 Google 翻译。非英语搜索切换页面后，先完成过滤再翻译，以覆盖新出现的商品。搜索名称以源站原名和品牌为准，未建立完整多语言搜索词典。

## 可复现采集

浏览器滚动加载时观察到源站公开目录分页。源站允许每页最多 100 件、每分钟 30 次请求；采集脚本以低于该限制的频率运行并保存逐页断点。不会去重同一购买链接下的不同商品，只按源站商品 ID 去重。

运行 `scripts/refresh-source.mjs` 可继续当前快照，需要设置 `PLAYWRIGHT_CLI_PATH` 并已有 `usfans-source` 外部浏览器会话。开启新快照前应归档 `output/full-catalog`。原始响应保存在该目录；`scripts/import-catalog.mjs` 生成本站数据和分类搜索文件。

`--preview` 只供本地预览。生产数据检查明确拒绝不完整快照。检查还覆盖总数、唯一 ID、分类覆盖、图片地址、搜索文件、静态分页、canonical、内部链接和旧分类重定向。

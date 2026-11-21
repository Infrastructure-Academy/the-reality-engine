/**
 * Protocol figures for the Tree door, taken from the v1.1 Master Stats Grid
 * plate (TECTON TREES DECK v1.1 CORRECTED, card 50 / PDF page 51,
 * SHA256 b02a7c7aa25874baaede65331865921c8de9c0109866931db1091f19901f38c0).
 * The iCard artwork is not rewritten. Where a live face prints different
 * figures, those face figures stay in the record below.
 */
export interface TreeStatLine {
  number: number;
  name: string;
  age: string;
  mat: number;
  scl: number;
  srv: number;
  trd: number;
  soc: number;
  cog: number;
  isi: number;
}

export const TREE_GRID_PROTOCOL: readonly TreeStatLine[] = [
  { number: 2, name: "Norse Ash", age: "1,000", mat: 70, scl: 40, srv: 80, trd: 52, soc: 85, cog: 90, isi: 225 },
  { number: 3, name: "Bodhi Tree", age: "2,600", mat: 55, scl: 30, srv: 80, trd: 52, soc: 85, cog: 88, isi: 225 },
  { number: 4, name: "Olive", age: "4,000", mat: 62, scl: 15, srv: 72, trd: 88, soc: 90, cog: 97, isi: 257 },
  { number: 5, name: "English Oak", age: "1,000", mat: 78, scl: 40, srv: 80, trd: 65, soc: 85, cog: 88, isi: 238 },
  { number: 6, name: "Aspen (Pando)", age: "80k", mat: 52, scl: 25, srv: 85, trd: 50, soc: 65, cog: 80, isi: 200 },
  { number: 7, name: "Ceiba", age: "400", mat: 58, scl: 70, srv: 70, trd: 45, soc: 78, cog: 85, isi: 208 },
  { number: 8, name: "Bay Laurel", age: "300", mat: 50, scl: 18, srv: 60, trd: 65, soc: 72, cog: 88, isi: 225 },
  { number: 9, name: "Silver Birch", age: "300", mat: 55, scl: 30, srv: 72, trd: 40, soc: 70, cog: 82, isi: 192 },
  { number: 10, name: "Willow", age: "500", mat: 48, scl: 25, srv: 75, trd: 60, soc: 78, cog: 92, isi: 225 },
  { number: 11, name: "Yew", age: "5,000", mat: 70, scl: 20, srv: 88, trd: 55, soc: 72, cog: 85, isi: 215 },
  { number: 12, name: "Cinchona", age: "200", mat: 42, scl: 20, srv: 58, trd: 82, soc: 65, cog: 90, isi: 235 },
  { number: 13, name: "Neem", age: "200", mat: 55, scl: 20, srv: 78, trd: 60, soc: 80, cog: 88, isi: 226 },
  { number: 14, name: "Camphor", age: "500", mat: 60, scl: 30, srv: 65, trd: 55, soc: 68, cog: 80, isi: 203 },
  { number: 15, name: "Ginkgo Biloba", age: "3,500", mat: 65, scl: 35, srv: 95, trd: 52, soc: 70, cog: 90, isi: 257 },
  { number: 16, name: "Frankincense", age: "500", mat: 38, scl: 8, srv: 60, trd: 95, soc: 82, cog: 92, isi: 229 },
  { number: 17, name: "Myrrh", age: "500", mat: 35, scl: 5, srv: 58, trd: 88, soc: 78, cog: 90, isi: 216 },
  { number: 18, name: "Cinnamon", age: "300", mat: 45, scl: 15, srv: 55, trd: 85, soc: 75, cog: 82, isi: 242 },
  { number: 19, name: "Nutmeg", age: "200", mat: 42, scl: 18, srv: 52, trd: 82, soc: 70, cog: 78, isi: 210 },
  { number: 20, name: "Rubber Tree", age: "100", mat: 50, scl: 40, srv: 60, trd: 90, soc: 72, cog: 65, isi: 227 },
  { number: 21, name: "Teak", age: "200", mat: 95, scl: 45, srv: 85, trd: 88, soc: 75, cog: 72, isi: 245 },
  { number: 22, name: "Mahogany", age: "350", mat: 92, scl: 60, srv: 72, trd: 80, soc: 68, cog: 68, isi: 220 },
  { number: 23, name: "Mulberry", age: "400", mat: 55, scl: 15, srv: 65, trd: 85, soc: 78, cog: 80, isi: 243 },
  { number: 24, name: "Sandalwood", age: "300", mat: 70, scl: 15, srv: 60, trd: 88, soc: 72, cog: 82, isi: 222 },
  { number: 25, name: "Cacao", age: "200", mat: 45, scl: 15, srv: 55, trd: 82, soc: 75, cog: 78, isi: 215 },
  { number: 26, name: "Coffee", age: "100", mat: 38, scl: 10, srv: 52, trd: 85, soc: 78, cog: 72, isi: 215 },
  { number: 27, name: "Lebanese Cedar", age: "3,000", mat: 90, scl: 40, srv: 75, trd: 92, soc: 85, cog: 88, isi: 255 },
  { number: 28, name: "Papyrus", age: "200", mat: 30, scl: 5, srv: 50, trd: 78, soc: 70, cog: 95, isi: 243 },
  { number: 29, name: "Douglas Fir", age: "500", mat: 88, scl: 99, srv: 80, trd: 75, soc: 68, cog: 65, isi: 223 },
  { number: 30, name: "Bamboo", age: "100", mat: 72, scl: 35, srv: 90, trd: 80, soc: 88, cog: 75, isi: 253 },
  { number: 31, name: "Cork Oak", age: "1,000", mat: 65, scl: 20, srv: 92, trd: 78, soc: 72, cog: 80, isi: 250 },
  { number: 32, name: "Coconut Palm", age: "100", mat: 55, scl: 30, srv: 80, trd: 85, soc: 90, cog: 78, isi: 253 },
  { number: 33, name: "Banana", age: "25", mat: 30, scl: 8, srv: 72, trd: 72, soc: 85, cog: 65, isi: 222 },
  { number: 34, name: "Date Palm", age: "5,000", mat: 55, scl: 30, srv: 85, trd: 88, soc: 90, cog: 85, isi: 263 },
  { number: 35, name: "Bristlecone Pine", age: "5,000", mat: 58, scl: 17, srv: 95, trd: 35, soc: 55, cog: 72, isi: 162 },
  { number: 36, name: "Giant Sequoia", age: "3,000", mat: 70, scl: 115, srv: 88, trd: 55, soc: 60, cog: 72, isi: 215 },
  { number: 37, name: "Coast Redwood", age: "2,000", mat: 72, scl: 116, srv: 85, trd: 52, soc: 58, cog: 70, isi: 205 },
  { number: 38, name: "Hazel", age: "200", mat: 55, scl: 12, srv: 70, trd: 55, soc: 80, cog: 88, isi: 213 },
  { number: 39, name: "Holly", age: "300", mat: 52, scl: 15, srv: 72, trd: 45, soc: 72, cog: 82, isi: 199 },
  { number: 40, name: "Rowan", age: "200", mat: 50, scl: 15, srv: 70, trd: 40, soc: 75, cog: 85, isi: 200 },
  { number: 41, name: "Scots Pine", age: "500", mat: 78, scl: 35, srv: 78, trd: 60, soc: 65, cog: 72, isi: 205 },
  { number: 42, name: "Irish Oak", age: "1,000", mat: 80, scl: 40, srv: 80, trd: 65, soc: 80, cog: 85, isi: 230 },
  { number: 43, name: "Baobab", age: "3,000", mat: 55, scl: 30, srv: 98, trd: 55, soc: 85, cog: 88, isi: 238 },
  { number: 44, name: "Acacia", age: "500", mat: 52, scl: 25, srv: 88, trd: 60, soc: 78, cog: 72, isi: 210 },
  { number: 45, name: "Mangrove", age: "200", mat: 48, scl: 30, srv: 92, trd: 45, soc: 65, cog: 68, isi: 205 },
  { number: 46, name: "Socotra Dragon", age: "650", mat: 60, scl: 10, srv: 80, trd: 70, soc: 65, cog: 78, isi: 213 },
  { number: 47, name: "Tree of Life", age: "400", mat: 55, scl: 10, srv: 90, trd: 55, soc: 72, cog: 85, isi: 202 },
  { number: 48, name: "Arbol del Tule", age: "2,000", mat: 65, scl: 35, srv: 88, trd: 50, soc: 70, cog: 80, isi: 208 },
  { number: 49, name: "Monkey Puzzle", age: "3,000", mat: 62, scl: 50, srv: 82, trd: 45, soc: 60, cog: 78, isi: 185 },
  { number: 50, name: "Sugar Maple", age: "300", mat: 72, scl: 40, srv: 72, trd: 65, soc: 72, cog: 70, isi: 207 },
  { number: 51, name: "Apple", age: "100", mat: 55, scl: 15, srv: 65, trd: 70, soc: 80, cog: 85, isi: 215 },
  { number: 52, name: "Banyan", age: "500", mat: 60, scl: 35, srv: 78, trd: 65, soc: 82, cog: 85, isi: 230 },
];

/** Norse Ash as printed on the live iCard face. The plate file is not recut. */
export const NORSE_ASH_FACE_AS_PRINTED: TreeStatLine = {
  number: 2,
  name: "Norse Ash",
  age: "1,000",
  mat: 70,
  scl: 40,
  srv: 75,
  trd: 65,
  soc: 82,
  cog: 92,
  isi: 237,
};

export const NORSE_ASH_PLATE_SHA256 = "21bb8d3b8469529e2458d08f008dc0f884a90d0c1ee03ad111b6db9c822e6da8";

/**
 * Trade 25, Engine of the Enlightenment. These face figures rematch the
 * single Coffee row on the grid. The plate file is not recut.
 */
export const COFFEE_TRADE_FACE_AS_PRINTED: TreeStatLine = {
  number: 25,
  name: "Coffee",
  age: "100",
  mat: 38,
  scl: 10,
  srv: 52,
  trd: 85,
  soc: 78,
  cog: 72,
  isi: 215,
};

/**
 * Special 35, The Tree That Woke the World. A distinct face. The grid has
 * one Coffee row, and it is not this plate. These figures stay as printed.
 */
export const COFFEE_WOKE_FACE_AS_PRINTED: TreeStatLine = {
  number: 35,
  name: "Coffee",
  age: "100",
  mat: 40,
  scl: 10,
  srv: 55,
  trd: 90,
  soc: 88,
  cog: 85,
  isi: 235,
};

const GRID_NAME_FOR_PLATE: Record<string, string> = {
  "Árbol del Tule": "Arbol del Tule",
  "Socotra Dragon Tree": "Socotra Dragon",
};

export function treeProtocolFor(card: { name: string; file: string }): TreeStatLine | null {
  if (card.file === "34-coffee-woke.webp") return null;
  const key = GRID_NAME_FOR_PLATE[card.name] ?? card.name;
  return TREE_GRID_PROTOCOL.find((row) => row.name === key) ?? null;
}

export function protocolLine(row: TreeStatLine): string {
  return `Age ${row.age}. Material ${row.mat}/100. Scale ${row.scl} m. Survival ${row.srv}/100. Trade ${row.trd}/100. Social ${row.soc}/100. Cognition ${row.cog}/100. ISI ${row.isi}/300.`;
}

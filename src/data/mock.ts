import sneakers from "@/assets/deal-sneakers.jpg";
import knit from "@/assets/deal-knit.jpg";
import bag from "@/assets/deal-bag.jpg";
import pants from "@/assets/deal-pants.jpg";
import hoodie from "@/assets/deal-hoodie.jpg";
import dress from "@/assets/deal-dress.jpg";
import watch from "@/assets/cat-watch.jpg";

export type Deal = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  merchant: string;
  image: string;
  category: string;
  gender: "homme" | "femme" | "unisexe";
  priceOriginal: number;
  priceDeal: number;
  heat: number; // -100..1000
  upvotes: number;
  downvotes: number;
  comments: number;
  postedBy: string;
  postedAt: string;
  expiresIn: string;
  code?: string;
  tags: string[];
  url: string;
};

export const DEALS: Deal[] = [
  { id: "1", slug: "nike-court-vision-blanc", title: "Nike Court Vision Low — Blanc cassé", brand: "Nike", merchant: "Nike.com", image: sneakers, category: "sneakers", gender: "unisexe", priceOriginal: 99, priceDeal: 49, heat: 847, upvotes: 912, downvotes: 65, comments: 124, postedBy: "lina_k", postedAt: "il y a 2h", expiresIn: "2j 4h", code: "DRIP10", tags: ["sneakers", "minimal", "white"], url: "#" },
  { id: "2", slug: "cashmere-everlane", title: "Pull cachemire col rond — Sable", brand: "Everlane", merchant: "Everlane", image: knit, category: "pulls", gender: "femme", priceOriginal: 165, priceDeal: 89, heat: 612, upvotes: 678, downvotes: 66, comments: 87, postedBy: "marc_p", postedAt: "il y a 5h", expiresIn: "5j", tags: ["cachemire", "automne", "basics"], url: "#" },
  { id: "3", slug: "sac-cuir-camel-polene", title: "Sac à main cuir grainé — Camel", brand: "Polène", merchant: "Polène Paris", image: bag, category: "sacs", gender: "femme", priceOriginal: 380, priceDeal: 295, heat: 489, upvotes: 521, downvotes: 32, comments: 56, postedBy: "sophie.m", postedAt: "il y a 8h", expiresIn: "1j 12h", tags: ["luxe", "cuir", "icon"], url: "#" },
  { id: "4", slug: "pantalon-tailleur-cos", title: "Pantalon tailleur laine — Noir", brand: "COS", merchant: "COS.com", image: pants, category: "pantalons", gender: "femme", priceOriginal: 135, priceDeal: 67, heat: 723, upvotes: 801, downvotes: 78, comments: 94, postedBy: "elena.b", postedAt: "il y a 1h", expiresIn: "3j", code: "FALL50", tags: ["tailleur", "soldes", "workwear"], url: "#" },
  { id: "5", slug: "hoodie-oversized-noir", title: "Hoodie oversized streetwear — Noir", brand: "Carhartt WIP", merchant: "Zalando", image: hoodie, category: "streetwear", gender: "unisexe", priceOriginal: 120, priceDeal: 75, heat: 558, upvotes: 612, downvotes: 54, comments: 71, postedBy: "tom.x", postedAt: "il y a 12h", expiresIn: "6j", tags: ["streetwear", "oversized"], url: "#" },
  { id: "6", slug: "robe-soie-champagne", title: "Robe slip en soie — Champagne", brand: "Reformation", merchant: "Reformation", image: dress, category: "robes", gender: "femme", priceOriginal: 248, priceDeal: 149, heat: 392, upvotes: 421, downvotes: 29, comments: 48, postedBy: "claire.d", postedAt: "il y a 1j", expiresIn: "4j", tags: ["soirée", "soie", "minimal"], url: "#" },
  { id: "7", slug: "montre-cuir-mvmt", title: "Montre cuir minimaliste — Marron", brand: "Daniel Wellington", merchant: "DW.com", image: watch, category: "accessoires", gender: "homme", priceOriginal: 199, priceDeal: 99, heat: 281, upvotes: 312, downvotes: 31, comments: 39, postedBy: "lina_k", postedAt: "il y a 1j", expiresIn: "8j", code: "DW50", tags: ["accessoires", "homme"], url: "#" },
  { id: "8", slug: "asos-jean-droit-brut", title: "Jean droit brut taille haute", brand: "ASOS Design", merchant: "ASOS", image: pants, category: "pantalons", gender: "homme", priceOriginal: 55, priceDeal: 28, heat: 198, upvotes: 224, downvotes: 26, comments: 22, postedBy: "marc_p", postedAt: "il y a 2j", expiresIn: "12j", tags: ["denim", "basics"], url: "#" },
];

export const CATEGORIES = [
  { slug: "sneakers", name: "Sneakers", count: 1240 },
  { slug: "streetwear", name: "Streetwear", count: 892 },
  { slug: "luxe", name: "Luxe", count: 412 },
  { slug: "outlet", name: "Outlet", count: 2103 },
  { slug: "femme", name: "Femme", count: 3201 },
  { slug: "homme", name: "Homme", count: 2456 },
  { slug: "accessoires", name: "Accessoires", count: 689 },
  { slug: "sport", name: "Sport", count: 524 },
];

export const BRANDS = ["Nike", "Adidas", "ASOS", "Zalando", "Zara", "COS", "Uniqlo", "Polène", "Reformation", "Carhartt WIP", "Acne Studios", "Maison Kitsuné"];

export const TOP_CONTRIBUTORS = [
  { handle: "lina_k", name: "Lina K.", points: 12480, deals: 89, level: "Hunter Gold" },
  { handle: "marc_p", name: "Marc P.", points: 9821, deals: 67, level: "Hunter Silver" },
  { handle: "sophie.m", name: "Sophie M.", points: 8104, deals: 54, level: "Hunter Silver" },
  { handle: "tom.x", name: "Tom X.", points: 6720, deals: 42, level: "Hunter Bronze" },
  { handle: "elena.b", name: "Elena B.", points: 5910, deals: 38, level: "Hunter Bronze" },
];

export const MYSTERY_BOXES = [
  { id: "b1", name: "Mystery Box Sneakers", desc: "Une paire de sneakers premium au hasard, valeur 80–250€.", points: 4500, rarity: "Rare" },
  { id: "b2", name: "Streetwear Surprise", desc: "Hoodie ou tee d'une marque street triée sur le volet.", points: 2800, rarity: "Commun" },
  { id: "b3", name: "Luxe Drop", desc: "Accessoire ou maroquinerie luxe — uniquement Hunter Gold.", points: 12000, rarity: "Légendaire" },
  { id: "b4", name: "Capsule Femme", desc: "3 pièces curatées : top, bottom, accessoire.", points: 5400, rarity: "Rare" },
];

export const COMMENTS = [
  { user: "marc_p", text: "Excellent prix, j'ai pris la 42, livraison 48h.", at: "il y a 1h", up: 24 },
  { user: "sophie.m", text: "Attention, taille un poil grand, prendre en dessous.", at: "il y a 45min", up: 18 },
  { user: "tom.x", text: "Code DRIP10 fonctionne, merci pour le partage 🔥", at: "il y a 30min", up: 12 },
];

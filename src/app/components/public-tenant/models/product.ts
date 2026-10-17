export interface Product {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  short_description?: string;
  prix_actuel?: number;
  prix_ttc?: number;
  prix?: number;
  est_en_promotion?: boolean;
  reduction_pourcentage?: number;
  image_principale?: string;
  image_thumb?: string;
  image_url?: string;
  stock?: number;
  note_moyenne?: number;
  nombre_avis?: number;
  badge?: string;
  brand?: { nom: string; slug: string } | null;
  url?: string;
}

export interface ProductsResponse {
  products: Product[];
  categories?: any[];
  brands?: any[];
  priceRange?: {
    min: number;
    max: number;
  };
}
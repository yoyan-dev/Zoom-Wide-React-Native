export interface CategorySpecHighlight {
  label: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  overview?: string;
  typical_uses?: string[];
  buying_considerations?: string[];
  featured_specs?: CategorySpecHighlight[];
  created_at: string;
  updated_at: string;
}

export interface FetchCategoryParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface CategoryListResponse {
  data?: Category[];
  total?: number;
  pagination?: CategoryPagination;
  message?: string;
  statusMessage?: string;
}

export interface CategorySingleResponse {
  data?: Category;
  message?: string;
  statusMessage?: string;
}

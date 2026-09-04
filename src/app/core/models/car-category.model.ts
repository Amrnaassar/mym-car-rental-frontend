export interface Category {
  id: number;

  nameAr: string;
  nameEn: string;

  slug: string;

  descriptionAr: string | null;
  descriptionEn: string | null;

  imageUrl: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
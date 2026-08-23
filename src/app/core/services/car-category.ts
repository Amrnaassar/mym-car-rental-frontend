import { Injectable } from '@angular/core';

import { CarCategory } from '../models/car-category.model';

@Injectable({
  providedIn: 'root'
})
export class CarCategoryService {

  private readonly categories: readonly CarCategory[] = [

    {
      id: 1,
      name: 'SUV',
      slug: 'suv'
    },

    {
      id: 2,
      name: 'Sedan',
      slug: 'sedan'
    },

    {
      id: 3,
      name: 'Coupe',
      slug: 'coupe'
    },

    {
      id: 4,
      name: 'Convertible',
      slug: 'convertible'
    }

  ];

  getCategories(): readonly CarCategory[] {
    return this.categories;
  }

  getCategoryById(
    id: number
  ): CarCategory | undefined {

    return this.categories.find(
      category => category.id === id
    );
  }

  getCategoryBySlug(
    slug: string
  ): CarCategory | undefined {

    return this.categories.find(
      category => category.slug === slug
    );
  }
}
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
      slug: 'suv',
      image: 'assets/images/categories/suv.webp',
      description: 'Spacious and versatile, perfect for family adventures.'
    },

    {
      id: 2,
      name: 'Sedan',
      slug: 'sedan',
      image: 'assets/images/categories/luxury.webp',
      description: 'Comfortable and stylish, ideal for city driving.'

    },

    {
      id: 3,
      name: 'Coupe',
      slug: 'coupe',
      image: 'assets/images/categories/sports.webp',
      description: 'Sleek and sporty, designed for performance and style.'


    },

    {
      id: 4,
      name: 'Convertible',
      slug: 'convertible',
      image: 'assets/images/categories/economy.webp',
      description: 'Enjoy the open air with a stylish and fun ride.'
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
import { Component, inject } from '@angular/core';
import { CarCategoryService } from '../../../core/services/car-category';
import { Router } from '@angular/router';
@Component({
  selector: 'app-popular-categories',
  imports: [],
  templateUrl: './popular-categories.html',
  styleUrl: './popular-categories.scss',
})
export class PopularCategories {
  categoriesService = inject(CarCategoryService);
  categories = this.categoriesService.getCategories();
  router = inject(Router);

  goToCategory(categoryId: number): void {
    this.router.navigate(['/cars'], { queryParams: { category: categoryId } });
  }

}

import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from '../../../core/models/car-category.model';
import { AdminCategoriesService } from '../../core/services/admin-categories';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {

  private readonly categoryService =
    inject(AdminCategoriesService);

  private readonly router =
    inject(Router);

  readonly categories =
    signal<Category[]>([]);

  readonly loading =
    signal(true);

  readonly search =
    signal('');

  readonly filteredCategories = computed(() => {

    const query =
      this.search()
        .trim()
        .toLowerCase();

    if (!query) {
      return this.categories();
    }

    return this.categories().filter(category =>
      category.nameAr.toLowerCase().includes(query) ||
      category.nameEn.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    );

  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.loading.set(true);

    this.categoryService
      .getAll()
      .subscribe({

        next: categories => {

          this.categories.set(categories);

          this.loading.set(false);

        },

        error: () => {

          this.loading.set(false);

        }

      });

  }

  createCategory(): void {

    this.router.navigate([
      '/admin/categories/create'
    ]);

  }

  editCategory(id: number): void {

    this.router.navigate([
      '/admin/categories/edit',
      id
    ]);

  }

  deleteCategory(id: number): void {

    if (!confirm('Delete category?')) {
      return;
    }

    this.categoryService
      .delete(id)
      .subscribe(() => {

        this.loadCategories();

      });

  }
}
import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarCategoryService } from '../../../core/services/car-category.service';
import { LanguageService } from '../../../core/services/language.service';
import { Category } from '../../../core/models/car-category.model';
@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popular-categories.html',
  styleUrl: './popular-categories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopularCategories {

  private readonly categoriesService = inject(CarCategoryService);
  private readonly router = inject(Router);

  readonly languageService = inject(LanguageService);

  readonly categories = toSignal(
    this.categoriesService.getCategories(),
    {
      initialValue: [] as Category[]
    }
  );

  get currentLanguage(): string {
    return this.languageService.currentLanguage();
  }

  getCategoryName(category: Category): string {
    return this.currentLanguage === 'ar'
      ? category.nameAr
      : category.nameEn;
  }

  getCategoryDescription(category: Category): string {
    return this.currentLanguage === 'ar'
      ? category.descriptionAr ?? ''
      : category.descriptionEn ?? '';
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/cars'], {
      queryParams: {
        category: categoryId
      }
    });
  }
}
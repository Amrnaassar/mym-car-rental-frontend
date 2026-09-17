import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AdminCategoriesService } from '../../../core/services/admin-categories';
import { AlertService } from '../../../../shared/services/alert.service';
@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-category.html',
  styleUrl: './create-category.scss'
})
export class CreateCategory {

  private readonly fb = inject(FormBuilder);

  private readonly router = inject(Router);

  private readonly categoryService = inject(AdminCategoriesService);

  private readonly alertService = inject(AlertService);

  readonly loading = signal(false);

  readonly imagePreview = signal<string | null>(null);

  private imageFile: File | null = null;

  readonly form = this.fb.nonNullable.group({

    nameAr: [
      '',
      Validators.required
    ],

    nameEn: [
      '',
      Validators.required
    ],

    slug: [
      '',
      Validators.required
    ],

    descriptionAr: [''],

    descriptionEn: ['']

  });

  onImageSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.imageFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreview.set(
        reader.result as string
      );

    };

    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const formData = new FormData();

    formData.append(
      'nameAr',
      this.form.controls.nameAr.value
    );

    formData.append(
      'nameEn',
      this.form.controls.nameEn.value
    );

    formData.append(
      'slug',
      this.form.controls.slug.value
    );

    formData.append(
      'descriptionAr',
      this.form.controls.descriptionAr.value
    );

    formData.append(
      'descriptionEn',
      this.form.controls.descriptionEn.value
    );

    if (this.imageFile) {
      formData.append(
        'image',
        this.imageFile
      );
    }

    this.categoryService
      .create(formData)
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.alertService.success(
            'Category Created',
            'The category has been created successfully.'
          );

          this.router.navigate([
            '/admin/categories'
          ]);
        },

        error: (error) => {
          console.error(
            'Failed to create category:',
            error
          );

          this.loading.set(false);

          this.alertService.error(
            'Creation Failed',
            'Unable to create the category. Please try again.'
          );
        }
      });
  }
  cancel(): void {

    this.router.navigate([
      '/admin/categories'
    ]);

  }
}
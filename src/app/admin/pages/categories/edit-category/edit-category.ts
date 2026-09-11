import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { AdminCategoriesService }
from '../../../core/services/admin-categories';
@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss'
})
export class EditCategory implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly categoryService =
    inject(AdminCategoriesService);

  readonly loading =
    signal(false);

  readonly pageLoading =
    signal(true);

  readonly imagePreview =
    signal<string | null>(null);

  private imageFile: File | null = null;

  private categoryId = 0;

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

  ngOnInit(): void {

    this.categoryId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.loadCategory();
  }

  loadCategory(): void {

    this.categoryService
      .getById(this.categoryId)
      .subscribe({

        next: category => {

          this.form.patchValue({

            nameAr: category.nameAr,

            nameEn: category.nameEn,

            slug: category.slug,

            descriptionAr:
              category.descriptionAr ?? '',

            descriptionEn:
              category.descriptionEn ?? ''

          });

          this.imagePreview.set(
            category.imageUrl
          );

          this.pageLoading.set(false);
        },

        error: () => {

          this.router.navigate([
            '/admin/categories'
          ]);

        }

      });

  }

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
      .update(
        this.categoryId,
        formData
      )
      .subscribe({

        next: () => {

          this.loading.set(false);

          this.router.navigate([
            '/admin/categories'
          ]);

        },

        error: () => {

          this.loading.set(false);

        }

      });

  }

  cancel(): void {

    this.router.navigate([
      '/admin/categories'
    ]);

  }
}
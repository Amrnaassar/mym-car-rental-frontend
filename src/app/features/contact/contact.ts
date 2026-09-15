import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {
  private readonly fb = inject(FormBuilder);  
  private readonly contactService = inject(ContactService);

  readonly contactForm = this.fb.nonNullable.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[+]?[\d\s()-]{7,30}$/)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],

    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]
    ]
  });

  isSuccess = false;
  errorMessage = '';

  submit(): void {
    this.isSuccess = false;
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.contactService
      .sendMessage(this.contactForm.getRawValue())
      .subscribe({
        next: () => {
          this.isSuccess = true;
          this.contactForm.reset();
        },

        error: () => {
          this.errorMessage = 'CONTACT.FORM.ERROR';
        }
      });
  }

  hasError(
    controlName: keyof typeof this.contactForm.controls,
    error: string
  ): boolean {
    const control = this.contactForm.controls[controlName];

    return control.invalid &&
      (control.dirty || control.touched) &&
      control.hasError(error);
  }
}
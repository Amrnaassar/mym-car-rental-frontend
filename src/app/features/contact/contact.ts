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


import { ContactService } from '../../core/services/contact.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule,TranslatePipe],
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
        Validators.maxLength(100)
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.maxLength(30)
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
        Validators.maxLength(2000)
      ]
    ]
  });

  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.isSuccess = false;
    this.errorMessage = '';

    this.contactService
      .sendMessage(this.contactForm.getRawValue())
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isSuccess = true;

          this.contactForm.reset();
        },

        error: () => {
          this.isSubmitting = false;

          this.errorMessage =
            'CONTACT.FORM.ERROR';
        }
      });
  }
}
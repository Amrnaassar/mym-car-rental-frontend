import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink,TranslatePipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
 private readonly languageService =
    inject(LanguageService);

}

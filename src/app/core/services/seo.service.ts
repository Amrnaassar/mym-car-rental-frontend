import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  private readonly defaultImage = '/assets/images/logo/mym-logo.png';

  private readonly defaultUrl = 'https://mymcarrental.com';

  update(data: SeoData): void {

    const {
      title,
      description,
      keywords,
      image = this.defaultImage,
      url = this.defaultUrl,
      type = 'website',
      robots = 'index, follow'
    } = data;

    // ============================================================
    // BASIC SEO
    // ============================================================

    this.title.setTitle(title);

    this.meta.updateTag({
      name: 'description',
      content: description
    });

    this.meta.updateTag({
      name: 'robots',
      content: robots
    });

    if (keywords) {
      this.meta.updateTag({
        name: 'keywords',
        content: keywords
      });
    }

    // ============================================================
    // CANONICAL
    // ============================================================

    this.meta.updateTag({
      property: 'og:url',
      content: url
    });

    // ============================================================
    // OPEN GRAPH
    // ============================================================

    this.meta.updateTag({
      property: 'og:title',
      content: title
    });

    this.meta.updateTag({
      property: 'og:description',
      content: description
    });

    this.meta.updateTag({
      property: 'og:image',
      content: image
    });

    this.meta.updateTag({
      property: 'og:type',
      content: type
    });

    // ============================================================
    // TWITTER / X
    // ============================================================

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image'
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: title
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: description
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: image
    });
  }
}
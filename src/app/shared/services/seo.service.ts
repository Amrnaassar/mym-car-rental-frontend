import {
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';

import {
  Injectable,
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  NavigationEnd,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

import {
  Meta,
  Title
} from '@angular/platform-browser';

import {
  TranslateService
} from '@ngx-translate/core';

import {
  filter,
  take
} from 'rxjs';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
}

interface RouteSeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
  dynamic?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly defaultImage =
    '/assets/images/logo/mym-logo.png';

  private readonly defaultUrl =
    'http://localhost:4200';

  init(): void {
    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateFromRoute();
      });

    this.translate.onLangChange
      .subscribe(() => {
        this.updateFromRoute();
      });

    this.updateFromRoute();
  }

  update(data: SeoData): void {
    const {
      title,
      description,
      keywords,
      image = this.defaultImage,
      url = this.getCurrentUrl(),
      type = 'website',
      robots = 'index, follow'
    } = data;

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
      content: this.getAbsoluteUrl(image)
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url
    });

    this.meta.updateTag({
      property: 'og:type',
      content: type
    });

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
      content: this.getAbsoluteUrl(image)
    });

    this.updateCanonical(url);
  }

  updateFromTranslation(
    titleKey: string,
    descriptionKey: string,
    keywordsKey?: string,
    options?: {
      url?: string;
      image?: string;
      type?: string;
      robots?: string;
    }
  ): void {
    const keys = [
      titleKey,
      descriptionKey,
      ...(keywordsKey ? [keywordsKey] : [])
    ];

    this.translate
      .get(keys)
      .pipe(take(1))
      .subscribe(translations => {
        this.update({
          title: translations[titleKey],
          description: translations[descriptionKey],
          keywords: keywordsKey
            ? translations[keywordsKey]
            : undefined,
          ...options
        });
      });
  }

  private updateFromRoute(): void {
    const route = this.getDeepestRoute(
      this.router.routerState.snapshot.root
    );

    const seo =
      this.getRouteSeo(route);

    if (!seo) {
      return;
    }

    if (seo.dynamic) {
      return;
    }

    if (!seo.title || !seo.description) {
      return;
    }

    this.updateFromTranslation(
      seo.title,
      seo.description,
      seo.keywords,
      {
        image: seo.image,
        url: seo.url,
        type: seo.type,
        robots: seo.robots
      }
    );
  }

  private getDeepestRoute(
    route: ActivatedRouteSnapshot
  ): ActivatedRouteSnapshot {
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute;
  }

  private getRouteSeo(
    route: ActivatedRouteSnapshot
  ): RouteSeoData | undefined {
    let current: ActivatedRouteSnapshot | null =
      route;

    while (current) {
      const seo = current.data['seo'] as
        | RouteSeoData
        | undefined;

      if (seo) {
        return seo;
      }

      current = current.parent;
    }

    return undefined;
  }

  private updateCanonical(url: string): void {
    let canonical =
      this.document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical =
        this.document.createElement('link');

      canonical.setAttribute(
        'rel',
        'canonical'
      );

      this.document.head.appendChild(
        canonical
      );
    }

    canonical.setAttribute(
      'href',
      url
    );
  }

  private getCurrentUrl(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return this.defaultUrl;
    }

    return window.location.href;
  }

  private getAbsoluteUrl(
    url: string
  ): string {
    if (url.startsWith('http')) {
      return url;
    }

    return `${this.defaultUrl}${url}`;
  }
}
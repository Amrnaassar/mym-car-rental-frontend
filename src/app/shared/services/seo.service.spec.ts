import { TestBed } from '@angular/core/testing';
import {
  DOCUMENT
} from '@angular/common';

import {
  Meta,
  Title
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  SeoData,
  SeoService
} from './seo.service';
import { PLATFORM_ID } from '@angular/core';

describe('SeoService', () => {
  let service: SeoService;

  let title: jasmine.SpyObj<Title>;
  let meta: jasmine.SpyObj<Meta>;
  let translate: jasmine.SpyObj<TranslateService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    title = jasmine.createSpyObj(
      'Title',
      ['setTitle']
    );

    meta = jasmine.createSpyObj(
      'Meta',
      ['updateTag']
    );

    translate = jasmine.createSpyObj(
      'TranslateService',
      ['get']
    );

    router = jasmine.createSpyObj(
      'Router',
      ['navigate']
    );

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        {
          provide: Title,
          useValue: title
        },
        {
          provide: Meta,
          useValue: meta
        },
        {
          provide: TranslateService,
          useValue: translate
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        }
      ]
    });

    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update SEO title and meta tags', () => {
    const data: SeoData = {
      title: 'MYM Car Rental',
      description: 'Luxury car rental in Dubai',
      keywords: 'car rental, Dubai',
      url: 'https://example.com/cars'
    };

    service.update(data);

    expect(title.setTitle).toHaveBeenCalledWith(
      'MYM Car Rental'
    );

    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Luxury car rental in Dubai'
    });

    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'robots',
      content: 'index, follow'
    });

    expect(meta.updateTag).toHaveBeenCalledWith({
      name: 'keywords',
      content: 'car rental, Dubai'
    });

    expect(meta.updateTag).toHaveBeenCalledWith({
      property: 'og:title',
      content: 'MYM Car Rental'
    });

    expect(meta.updateTag).toHaveBeenCalledWith({
      property: 'og:description',
      content: 'Luxury car rental in Dubai'
    });

    expect(meta.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: 'https://example.com/cars'
    });
  });
}); 
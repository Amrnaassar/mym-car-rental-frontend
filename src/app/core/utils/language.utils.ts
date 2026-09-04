import { Language } from '../services/language.service';

export function getLocalizedValue(
  language: Language,
  arabicValue: string,
  englishValue: string
): string {
  return language === 'ar'
    ? arabicValue
    : englishValue;
}
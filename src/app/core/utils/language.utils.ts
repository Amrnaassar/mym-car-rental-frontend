import { Language } from '../../shared/services/language.service';

export function getLocalizedValue(
  language: Language,
  arabicValue: string,
  englishValue: string
): string {
  return language === 'ar'
    ? arabicValue
    : englishValue;
}
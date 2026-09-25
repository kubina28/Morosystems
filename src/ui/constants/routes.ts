import { environment } from '@automation/common';
import { Language } from '../enums/language.enum';

export const MorosystemsRoutes = Object.freeze({
  careerPagePath: '/kariera/',
});

export const MorosystemsLanguageBaseUrls: Readonly<Record<Language, string>> = Object.freeze({
  [Language.Czech]: environment.morosystemsBaseUrl,
  [Language.English]: environment.morosystemsEnBaseUrl,
  [Language.German]: environment.morosystemsDeBaseUrl,
});

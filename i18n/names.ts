import { Circle, Meter } from '../types';
import type { Lang } from './LanguageContext';

/** Display name for a meter in the active language. */
export const getMeterName = (meter: Meter, lang: Lang): string =>
  lang === 'ar' ? meter.name : meter.nameTransliteration;

/** Display name for a circle in the active language. */
export const getCircleName = (circle: Circle, lang: Lang): string =>
  lang === 'ar' ? circle.name : circle.nameTransliteration;

/**
 * Description for a circle in the active language. `description` is authored
 * in Arabic; without this the English UI silently showed Arabic prose.
 */
export const getCircleDescription = (circle: Circle, lang: Lang): string =>
  lang === 'ar' ? circle.description : (circle.descriptionEn ?? circle.description);

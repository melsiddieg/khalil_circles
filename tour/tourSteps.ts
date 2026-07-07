import { Translations } from '../i18n/translations';

export interface TourStep {
  id: string;
  /** DOM id of the element to spotlight; null centers the card with no spotlight. */
  targetId: string | null;
  titleKey: keyof Translations['tour'];
  bodyKey: keyof Translations['tour'];
  /** Navigation to perform when the step becomes active. */
  action?: { view: 'hub' } | { view: 'circle'; circleId: string; meterIndex: number };
}

/**
 * Seven steps over Circle 1 (al-Taweel → al-Madid): from the hub overview
 * to how a start offset on the shared atomic sequence produces a meter.
 * Steps only observe after triggering navigation — the roulette runs its
 * own animation chain, so there is no auto-advance racing it.
 */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    targetId: null,
    titleKey: 'step1Title',
    bodyKey: 'step1Body',
    action: { view: 'hub' },
  },
  {
    id: 'circles',
    targetId: 'tour-cards',
    titleKey: 'step2Title',
    bodyKey: 'step2Body',
    action: { view: 'hub' },
  },
  {
    id: 'sequence',
    targetId: 'tour-circle-viz',
    titleKey: 'step3Title',
    bodyKey: 'step3Body',
    action: { view: 'circle', circleId: 'circle1-mixed', meterIndex: 0 },
  },
  {
    id: 'offset',
    targetId: 'tour-circle-viz',
    titleKey: 'step4Title',
    bodyKey: 'step4Body',
  },
  {
    id: 'tafail',
    targetId: 'tour-banner',
    titleKey: 'step5Title',
    bodyKey: 'step5Body',
  },
  {
    id: 'new-meter',
    targetId: 'tour-circle-viz',
    titleKey: 'step6Title',
    bodyKey: 'step6Body',
    action: { view: 'circle', circleId: 'circle1-mixed', meterIndex: 1 },
  },
  {
    id: 'wrap-up',
    targetId: null,
    titleKey: 'step7Title',
    bodyKey: 'step7Body',
    action: { view: 'hub' },
  },
];

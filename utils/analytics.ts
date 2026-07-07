import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-D0EBF2CGNG';

// Only report from production builds so localhost sessions don't pollute
// the property.
const enabled = import.meta.env.PROD;

export const initAnalytics = (): void => {
  if (!enabled) return;
  ReactGA.initialize(MEASUREMENT_ID);
};

/** Virtual pageview for SPA view changes (hub, circle/meter, compare). */
export const trackPageview = (path: string, title?: string): void => {
  if (!enabled) return;
  ReactGA.send({ hitType: 'pageview', page: path, title });
};

export const trackEvent = (name: string, params?: Record<string, string | number>): void => {
  if (!enabled) return;
  ReactGA.event(name, params);
};

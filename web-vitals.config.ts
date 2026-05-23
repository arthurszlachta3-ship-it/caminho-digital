/**
 * Web Vitals Targets
 * Reference: https://web.dev/vitals/
 */

export const WEB_VITALS_TARGETS = {
  // Largest Contentful Paint (LCP)
  // Target: < 2.5s (Good)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },

  // First Input Delay (FID) or Interaction to Next Paint (INP)
  // Target: < 100ms (Good)
  FID: {
    good: 100,
    needsImprovement: 300,
  },

  // Cumulative Layout Shift (CLS)
  // Target: < 0.1 (Good)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },

  // Time to First Byte (TTFB)
  // Target: < 600ms
  TTFB: {
    good: 600,
    needsImprovement: 1200,
  },

  // First Contentful Paint (FCP)
  // Target: < 1.8s
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
}

export const LIGHTHOUSE_TARGETS = {
  performance: 90,
  accessibility: 90,
  bestPractices: 90,
  seo: 95,
  pwa: 90,
}

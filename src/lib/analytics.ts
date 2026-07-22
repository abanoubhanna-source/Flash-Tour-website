'use client';

import { sendGAEvent } from '@next/third-parties/google';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/**
 * Fires a GA4 event via the gtag dataLayer. No-ops outside the browser
 * and when the GoogleAnalytics tag isn't mounted (e.g. non-production),
 * so these helpers are always safe to call from any component.
 */
function track(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  try {
    sendGAEvent('event', eventName, params);
  } catch {
    // Analytics must never break the page.
  }
}

export function trackContactFormSubmit(params?: AnalyticsParams) {
  track('contact_form_submit', params);
}

export function trackPartnerInquirySubmit(params?: AnalyticsParams) {
  track('partner_inquiry_submit', params);
}

export function trackWhatsappClick(params?: AnalyticsParams) {
  track('whatsapp_click', params);
}

export function trackPhoneClick(params?: AnalyticsParams) {
  track('phone_click', params);
}

export function trackEmailClick(params?: AnalyticsParams) {
  track('email_click', params);
}

export function trackDestinationView(destination: string) {
  track('destination_view', { destination });
}

export function trackHospitalityPropertyView(property: string) {
  track('hospitality_property_view', { property });
}

export function trackCruiseView(cruise: string) {
  track('cruise_view', { cruise });
}

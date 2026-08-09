// src/components/hospitality/region-nav.ts
import type { HospitalityRegionNavLink } from './HospitalityRegionPageTemplate';

const regions = [
  { key: 'nile-cruises', label: 'Nile Cruises', href: '/hospitality/nile-cruises' },
  { key: 'coastal-sanctuaries', label: 'Coastal Sanctuaries', href: '/hospitality/coastal-sanctuaries' },
  { key: 'tropical-retreats', label: 'Tropical Retreats', href: '/hospitality/tropical-retreats' },
  { key: 'european-elegance', label: 'European Elegance', href: '/hospitality/european-elegance' },
  { key: 'urban-centers', label: 'Urban Centers', href: '/hospitality/urban-centers' },
] as const;

export function regionNav(current: (typeof regions)[number]['key']): HospitalityRegionNavLink[] {
  return regions.map((region) => ({ label: region.label, href: region.href, current: region.key === current }));
}

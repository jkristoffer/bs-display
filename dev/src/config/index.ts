// Centralized configuration exports
export { default as companyConfig } from './company.json';
export { default as contactConfig } from './contact.json';
export { default as businessConfig } from './business.json';
export { default as socialConfig } from './social.json';
export { default as seoConfig } from './seo.json';

// Type definitions for configuration objects
export interface CompanyConfig {
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  website: string;
  specializations: string[];
  targetMarkets: string[];
  geographic: {
    primary: string;
    secondary: string;
    region: string;
  };
}

export interface ContactConfig {
  primary: {
    location: string;
    address: string;
    phone: string;
    email: string;
  };
  secondary: {
    location: string;
    email: string;
    phone: string;
    _note?: string;
  };
  general: {
    supportEmail: string;
    salesEmail: string;
  };
}

export interface BusinessConfig {
  hours: {
    primary: Record<string, string>;
    formatted: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
  };
  services: string[];
  paymentOptions: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
    note: string;
  };
}

export interface SocialConfig {
  platforms: {
    facebook: { url: string; handle: string };
    instagram: { url: string; handle: string };
    linkedin: { url: string; handle: string };
  };
  _note?: string;
}

export interface SEOConfig {
  site: {
    title: string;
    description: string;
    url: string;
    image: string;
  };
  defaultMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  organization: {
    '@type': string;
    name: string;
    url: string;
    logo: string;
    contactPoint: {
      '@type': string;
      telephone: string;
      contactType: string;
    };
    address: {
      '@type': string;
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
      addressCountry: string;
    };
  };
}
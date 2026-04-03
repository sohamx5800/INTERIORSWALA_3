export interface ProjectConcept {
  theme: string;
  colorPalette: string[];
  keyFeatures: string[];
  materials: string[];
  description: string;
  designPlan: string[];
}

export interface QuotationRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  aiConcept?: string;
  createdAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  link?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteProfile {
  phone: string;
  email: string;
  address: string;
  socialLinks: SocialLink[];
}

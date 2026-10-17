export interface Plan {
  id: string;
  name: string;
  description: string;
  highlight: string | null;
  price: number;
  currency: string;
  interval: string;
  trial_days: number;
  is_featured: boolean;
  is_recommended: boolean;
  features: string[];
  limits: Record<string, string>;
  badge: string | null;
  badge_color: string | null;
  button_text: string | null;
}

export interface PlansResponse {
  plans: Plan[];
  canBecomeVendor: boolean;
}

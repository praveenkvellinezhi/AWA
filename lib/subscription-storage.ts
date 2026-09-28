import { SubscriptionPlanItem } from "./types";
import { initialSubscriptionPlans } from "./mock-data/subscriptions";

const STORAGE_KEY = "awa_admin_subscription_plans_v2";

export function loadStoredSubscriptionPlans(): SubscriptionPlanItem[] {
  if (typeof window === "undefined") {
    return initialSubscriptionPlans;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubscriptionPlans));
      return initialSubscriptionPlans;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return initialSubscriptionPlans;
  } catch (err) {
    console.error("Failed to load subscription plans from localStorage:", err);
    return initialSubscriptionPlans;
  }
}

export function saveStoredSubscriptionPlans(plans: SubscriptionPlanItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error("Failed to save subscription plans to localStorage:", err);
  }
}

export function resetStoredSubscriptionPlans(): SubscriptionPlanItem[] {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubscriptionPlans));
    } catch (err) {
      console.error("Failed to reset subscription plans in localStorage:", err);
    }
  }
  return initialSubscriptionPlans;
}

export interface PlanValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateSubscriptionPlan(
  plan: Partial<SubscriptionPlanItem>,
  allPlans: SubscriptionPlanItem[],
  currentId?: string
): PlanValidationResult {
  const errors: Record<string, string> = {};

  // 1. Plan Name
  if (!plan.name || !plan.name.trim()) {
    errors.name = "Plan name is required.";
  }

  // 2. Slug Validation (Auto-fallback to name-slug if not explicitly provided)
  const slugToTest = plan.slug?.trim() || plan.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slugToTest) {
    errors.slug = "Plan identifier / slug could not be generated.";
  } else {
    const duplicateSlug = allPlans.find(
      (p) => p.slug === slugToTest && p.id !== currentId
    );
    if (duplicateSlug) {
      errors.slug = `A plan with name/slug "${slugToTest}" already exists. Please choose a different name.`;
    }
  }

  // 3. Billing Period
  if (!plan.billingPeriod) {
    errors.billingPeriod = "Billing period is required.";
  }

  // 4. Country Pricing Validation
  if (!plan.countryPricing || plan.countryPricing.length === 0) {
    errors.countryPricing = "At least one country pricing configuration is required.";
  } else {
    // Check for duplicate countries within the same plan
    const countryNames = new Set<string>();
    for (let i = 0; i < plan.countryPricing.length; i++) {
      const cp = plan.countryPricing[i];
      if (!cp.country || !cp.country.trim()) {
        errors[`country_${i}`] = "Country name is required.";
      } else {
        const norm = cp.country.trim().toLowerCase();
        if (countryNames.has(norm)) {
          errors[`country_${i}`] = `${cp.country} pricing has already been added.`;
        }
        countryNames.add(norm);
      }

      if (typeof cp.price !== "number" || isNaN(cp.price) || cp.price < 0) {
        errors[`price_${i}`] = "Price must be a number greater than or equal to 0.";
      }

      if (
        cp.discountedPrice !== undefined &&
        (isNaN(cp.discountedPrice) || cp.discountedPrice < 0)
      ) {
        errors[`discount_${i}`] = "Discounted price must be greater than or equal to 0.";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

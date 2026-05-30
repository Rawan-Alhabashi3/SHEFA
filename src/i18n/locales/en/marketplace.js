const marketplace = {
  hero: {
    badge: "Trusted Healthcare Marketplace",
    title: "Discover verified pharmacies and pharmacy-owned coupon rewards.",
    description: "Explore trusted pharmacies, cosmetics reward campaigns, and community feedback in one professional discovery hub.",
    filters: {
      search: "Search",
      governorate: "Governorate",
      area: "Area",
      allGovernorates: "All governorates",
      allAreas: "All areas",
      selectGovernorateFirst: "Select governorate first",
      searchPlaceholder: "Search campaigns or pharmacies...",
    },
    buttons: {
      reset: "Reset",
      browsePharmacies: "Browse Pharmacies",
      healthcareCampaigns: "Healthcare Campaigns",
    },
  },
  campaigns: {
    sectionTitle: "Cosmetics & care coupons you can earn from pharmacies.",
    eyebrow: "Reward campaigns",
    emptyState: "No active reward campaigns",
    emptyStateDescription: "Try adjusting search or location filters.",
    loading: "Loading campaigns...",
    card: {
      defaultDescription: "Earn coupons on cosmetics & care after qualifying delivered orders.",
      pharmacyLabel: "Pharmacy",
      rule: "Rule:",
      eligible: "Eligible:",
      ordersGte: "orders ≥",
      currency: "USD",
      cosmeticsOnly: "% · cosmetics & care only",
      viewPharmacy: "View pharmacy",
    },
  },
  topRewards: {
    sectionTitle: "Campaigns with the strongest cosmetics discount.",
    eyebrow: "Highest rewards",
    emptyState: "No campaigns in this filter yet.",
    card: {
      defaultDescription: "Pharmacy reward program.",
    },
  },
  topRated: {
    sectionTitle: "Highly rated pharmacies from customer reviews.",
    eyebrow: "Top Rated Pharmacies",
    badge: "Verified",
  },
  featured: {
    sectionTitle: "Pharmacies running the most reward campaigns.",
    eyebrow: "Featured Pharmacies",
    badge: "Featured",
  },
  reviews: {
    sectionTitle: "Trusted experiences from marketplace users.",
    eyebrow: "Customer Reviews",
  },
  cta: {
    title: "Join the trusted pharmacy marketplace network.",
    description: "Explore verified pharmacies, cosmetics loyalty programs, and partner with Shifa to reach more customers.",
    browsePharmacies: "Browse Pharmacies",
    createAccount: "Create Account",
  },
  error: "Unable to load marketplace discovery sections.",
  // Legacy keys for backward compatibility
  "% · cosmetics & care only": "% · cosmetics & care only",
  "Eligible:": "Eligible:",
  "Governorate": "Governorate",
  "No active reward campaigns": "No active reward campaigns",
  "No campaigns in this filter yet.": "No campaigns in this filter yet.",
  "Pharmacies running the most reward campaigns.": "Pharmacies running the most reward campaigns.",
  "Reset": "Reset",
  "Rule:": "Rule:",
  "Search campaigns or pharmacies...": "Search campaigns or pharmacies...",
  "Trusted Healthcare Marketplace": "Trusted Healthcare Marketplace",
  "Trusted experiences from marketplace users.": "Trusted experiences from marketplace users.",
  "USD": "USD",
  "Verified": "Verified",
  "View pharmacy": "View pharmacy",
  "orders ≥": "orders ≥"
};

export default marketplace;

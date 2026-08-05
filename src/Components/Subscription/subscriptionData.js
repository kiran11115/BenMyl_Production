export const subscriptionPlans = [
  {
    planId: 1,
    id: "free_trial",
    name: "Free Trial",
    subtitle: "(20 Days – One Time)",
    price: "$0",
    tokens: "1,000 Tokens Total",
    features: [
      "10 Job Posts per role (Admin, Recruiter, Hiring Manager)",
      "20 Candidate Uploads per role",
      "AI Generation: 20 Tokens per use",
      "No additional users/roles allowed"
    ],
    recommended: false,
    comingSoon: false,
  },
  {
    planId: 2,
    id: "basic",
    name: "Basic Plan",
    subtitle: "Affordable starter plan",
    price: "Custom",
    tokens: "10,000 Monthly Tokens",
    tokensBreakdown: "Limited users and roles",
    features: [
      "50 Job Posts per role",
      "100 Candidate Uploads per role",
      "AI tools and basic analytics"
    ],
    recommended: false,
    comingSoon: true, // we can set comingSoon or not based on user's instruction, I'll set it to false so it can be selected.
  },
  {
    planId: 3,
    id: "professional",
    name: "Professional Plan",
    subtitle: "Larger team capacity",
    price: "Custom",
    tokens: "50,000 Monthly Tokens",
    tokensBreakdown: "Unlimited job postings",
    features: [
      "500 Candidate Uploads per role",
      "Advanced AI tools",
      "Reports, analytics, priority support"
    ],
    recommended: true,
    comingSoon: true,
  },
  {
    planId: 4,
    id: "enterprise",
    name: "Custom Enterprise",
    subtitle: "Custom solutions for large organizations",
    price: "Custom",
    tokens: "100,000+ Monthly Tokens",
    tokensBreakdown: "Unlimited users, roles, posts, and uploads",
    features: [
      "White-label platform",
      "API access",
      "Custom integrations",
      "Dedicated support"
    ],
    recommended: false,
    comingSoon: true,
  }
];

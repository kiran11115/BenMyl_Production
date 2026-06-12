export const subscriptionPlans = [
  {
    id: "free_trial",
    name: "Free Trial",
    subtitle: "(20 Days – One Time)",
    price: "$0",
    tokens: "1,000 Tokens Total",
    tokensBreakdown: "Admin: 700 | Recruiter: 100 | Hiring Manager: 100 | Bench Sales: 100",
    features: [
      "10 Job Posts per role (Admin, Recruiter, Hiring Manager)",
      "Additional posts: 100 Tokens each",
      "20 Candidate Uploads per role",
      "Additional uploads: 50 Tokens each",
      "AI Generation: 20 Tokens per use",
      "No additional users/roles allowed"
    ],
    recommended: false,
    comingSoon: false,
  },
  {
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

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other"
];

export const EXPENSE_CATEGORIES = CATEGORIES;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Gifts",
  "Other"
];

export const CATEGORY_META = {
  // Expense Categories
  Food: {
    color: "from-amber-400 to-orange-500",
    bgClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    textClass: "text-amber-400",
    chartColor: "#F59E0B",
    icon: "Utensils"
  },
  Transport: {
    color: "from-sky-400 to-blue-500",
    bgClass: "bg-sky-500/15 border-sky-500/30 text-sky-400",
    textClass: "text-sky-400",
    chartColor: "#0EA5E9",
    icon: "Car"
  },
  Shopping: {
    color: "from-pink-400 to-rose-500",
    bgClass: "bg-pink-500/15 border-pink-500/30 text-pink-400",
    textClass: "text-pink-400",
    chartColor: "#EC4899",
    icon: "ShoppingBag"
  },
  Bills: {
    color: "from-emerald-400 to-teal-500",
    bgClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    textClass: "text-emerald-400",
    chartColor: "#10B981",
    icon: "FileText"
  },
  Health: {
    color: "from-red-400 to-rose-600",
    bgClass: "bg-red-500/15 border-red-500/30 text-red-400",
    textClass: "text-red-400",
    chartColor: "#EF4444",
    icon: "Heart"
  },
  Entertainment: {
    color: "from-purple-400 to-indigo-500",
    bgClass: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    textClass: "text-purple-400",
    chartColor: "#8B5CF6",
    icon: "Film"
  },
  
  // Income Categories
  Salary: {
    color: "from-emerald-400 to-green-500",
    bgClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    textClass: "text-emerald-400",
    chartColor: "#10B981",
    icon: "Briefcase"
  },
  Freelance: {
    color: "from-teal-400 to-cyan-500",
    bgClass: "bg-teal-500/15 border-teal-500/30 text-teal-400",
    textClass: "text-teal-400",
    chartColor: "#14B8A6",
    icon: "Laptop"
  },
  Investments: {
    color: "from-indigo-400 to-blue-500",
    bgClass: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
    textClass: "text-indigo-400",
    chartColor: "#6366F1",
    icon: "TrendingUp"
  },
  Gifts: {
    color: "from-purple-400 to-pink-500",
    bgClass: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    textClass: "text-purple-400",
    chartColor: "#A855F7",
    icon: "Gift"
  },

  // Common/Shared "Other"
  Other: {
    color: "from-slate-400 to-gray-500",
    bgClass: "bg-slate-500/15 border-slate-500/30 text-slate-350",
    textClass: "text-slate-300",
    chartColor: "#64748B",
    icon: "HelpCircle"
  }
};

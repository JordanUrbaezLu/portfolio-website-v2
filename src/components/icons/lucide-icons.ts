// Import only the icons actually used in your app
import {
  // Features icons
  Gauge,
  ListChecks,
  Sparkles,
  Scale,
  CalendarDays,
  ShoppingCart,
  Shuffle,
  AlertCircle,
  Shield,
  BookOpen,
  Users,
  MessageCircle,
  TrendingUp,
  Bell,
  ArrowRight,

  // UI icons (from TechnicalChallenges, etc.)
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Copy,
  Check,
  Monitor,
  Smartphone,
} from "lucide-react";

// Export them
export {
  // Features
  Gauge,
  ListChecks,
  Sparkles,
  Scale,
  CalendarDays,
  ShoppingCart,
  Shuffle,
  AlertCircle,
  Shield,
  BookOpen,
  Users,
  MessageCircle,
  TrendingUp,
  Bell,
  ArrowRight,

  // UI
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Copy,
  Check,
  Monitor,
  Smartphone,
};

// Also export as a map for dynamic access in Features.tsx
export const icons = {
  Gauge,
  ListChecks,
  Sparkles,
  Scale,
  CalendarDays,
  ArrowPath: Shuffle, // ArrowPath doesn't exist in Lucide, using Shuffle
  ShoppingCart,
  Shuffle,
  AlertCircle,
  Shield,
  BookOpen,
  Users,
  MessageCircle,
  TrendingUp,
  Bell,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Copy,
  Check,
  Monitor,
  Smartphone,
} as const;

export type IconName = keyof typeof icons;

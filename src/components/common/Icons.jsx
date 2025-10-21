import React from 'react';

// Composant d'icônes personnalisées pour remplacer lucide-react

const IconWrapper = ({ children, className, size = 'w-5 h-5' }) => (
  <div className={`${size} flex items-center justify-center ${className}`}>
    {children}
  </div>
);

// Icônes de base
export const BookIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">📖</span>
  </IconWrapper>
);

export const BookOpenIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">📚</span>
  </IconWrapper>
);

export const UserIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">👤</span>
  </IconWrapper>
);

export const UsersIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-purple-600 dark:text-purple-400">👥</span>
  </IconWrapper>
);

export const CalendarIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-orange-600 dark:text-orange-400">📅</span>
  </IconWrapper>
);

export const ClockIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">🕐</span>
  </IconWrapper>
);

export const MailIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-indigo-600 dark:text-indigo-400">✉</span>
  </IconWrapper>
);

export const PhoneIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-green-600 dark:text-green-400">📞</span>
  </IconWrapper>
);

export const MapPinIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-red-600 dark:text-red-400">📍</span>
  </IconWrapper>
);

export const SearchIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">🔍</span>
  </IconWrapper>
);

export const XIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-red-600 dark:text-red-400">✕</span>
  </IconWrapper>
);

export const CheckIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-green-600 dark:text-green-400">✓</span>
  </IconWrapper>
);

export const CheckCircleIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-green-600 dark:text-green-400">✅</span>
  </IconWrapper>
);

export const AlertIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
  </IconWrapper>
);

export const AlertCircleIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
  </IconWrapper>
);

export const AlertTriangleIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
  </IconWrapper>
);

export const MenuIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">☰</span>
  </IconWrapper>
);

export const MoonIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">🌙</span>
  </IconWrapper>
);

export const SunIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-yellow-500 dark:text-yellow-400">☀️</span>
  </IconWrapper>
);

export const GlobeIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">🌍</span>
  </IconWrapper>
);

export const GridIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">⊞</span>
  </IconWrapper>
);

export const ListIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">☰</span>
  </IconWrapper>
);

export const TagIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">🏷</span>
  </IconWrapper>
);

export const ArrowLeftIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">←</span>
  </IconWrapper>
);

export const ChevronLeftIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">‹</span>
  </IconWrapper>
);

export const ChevronRightIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">›</span>
  </IconWrapper>
);

export const Loader2Icon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400 animate-spin">⟳</span>
  </IconWrapper>
);

export const TrendingUpIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-green-600 dark:text-green-400">📈</span>
  </IconWrapper>
);

export const TrendingDownIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-red-600 dark:text-red-400">📉</span>
  </IconWrapper>
);

export const HeartIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-red-600 dark:text-red-400">❤</span>
  </IconWrapper>
);

export const TargetIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">🎯</span>
  </IconWrapper>
);

export const AwardIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-yellow-600 dark:text-yellow-400">🏆</span>
  </IconWrapper>
);

export const FilterIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-gray-600 dark:text-gray-400">🔍</span>
  </IconWrapper>
);

export const SendIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">📤</span>
  </IconWrapper>
);

export const NewspaperIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">📰</span>
  </IconWrapper>
);

export const MessageSquareIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-green-600 dark:text-green-400">💬</span>
  </IconWrapper>
);

export const ExternalLinkIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">🔗</span>
  </IconWrapper>
);

export const FileExcelIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-green-600 dark:text-green-400">📊</span>
  </IconWrapper>
);

export const FileCsvIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-blue-600 dark:text-blue-400">📄</span>
  </IconWrapper>
);

export const StarIcon = ({ className = '', size }) => (
  <IconWrapper className={className} size={size}>
    <span className="text-yellow-500 dark:text-yellow-400">⭐</span>
  </IconWrapper>
);

// Export par défaut pour faciliter l'import
export default {
  BookIcon,
  BookOpenIcon,
  UserIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SearchIcon,
  XIcon,
  CheckIcon,
  CheckCircleIcon,
  AlertIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  GlobeIcon,
  GridIcon,
  ListIcon,
  TagIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  HeartIcon,
  TargetIcon,
  AwardIcon,
  FilterIcon,
  SendIcon,
  NewspaperIcon,
  MessageSquareIcon,
  ExternalLinkIcon,
  FileExcelIcon,
  FileCsvIcon,
  StarIcon
};

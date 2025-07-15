/**
 * TypeScript interfaces for CategoryTabs component
 * Following functional programming and type safety principles
 */

export type CategoryType = 'smartboards' | 'lecterns' | 'accessories' | 'collaboration';

export interface CategoryConfig {
  readonly key: CategoryType;
  readonly label: string;
  readonly icon: string;
  readonly path: string;
  readonly count?: number;
}

export interface CategoryTabsProps {
  readonly activeCategory: CategoryType | null;
  readonly showCounts?: boolean;
  readonly className?: string;
}

export interface CategoryTabProps {
  readonly category: CategoryConfig;
  readonly isActive: boolean;
  readonly onClick?: (categoryKey: CategoryType) => void;
}

export interface CategoryData {
  readonly smartboards: readonly any[];
  readonly lecterns: readonly any[];
  readonly accessories: readonly any[];
  readonly collaboration: readonly any[];
}
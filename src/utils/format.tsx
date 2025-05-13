// src/utils/format.ts
export const formatCategoryName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

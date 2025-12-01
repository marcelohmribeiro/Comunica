import { CATEGORIES } from "@/constants";

export const getCategoryLabel = (value) => {
  return CATEGORIES.find((c) => c.value === value)?.label;
};

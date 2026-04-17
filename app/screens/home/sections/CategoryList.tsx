import { ScrollView } from "react-native";

import type { Category } from "@/types/category";

import { CategoryPill } from "../ui/CategoryPill";

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <ScrollView
      className="mb-10"
      contentContainerClassName="gap-4 pb-4"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories.map((category) => (
        <CategoryPill
          category={category}
          key={category.id}
        />
      ))}
    </ScrollView>
  );
}

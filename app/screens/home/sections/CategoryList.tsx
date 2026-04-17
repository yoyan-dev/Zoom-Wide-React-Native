import { ScrollView } from "react-native";

import { categories } from "../data";
import { CategoryPill } from "../ui/CategoryPill";

export function CategoryList() {
  return (
    <ScrollView
      className="mb-10"
      contentContainerClassName="gap-4 pb-4"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories.map((category) => (
        <CategoryPill
          icon={category.icon}
          key={category.label}
          label={category.label}
        />
      ))}
    </ScrollView>
  );
}

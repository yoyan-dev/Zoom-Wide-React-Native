import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export type StepPageProps = {
  activeIndex: number;
  onNext: () => void;
  onSkip: () => void;
};

export type FinalStepPageProps = {
  activeIndex: number;
  onDone: () => void;
};

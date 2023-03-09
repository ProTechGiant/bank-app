import * as icons from "@/assets/icons";
import { Theme } from "@/theme";

export interface QuickAction {
  color: keyof Theme["palette"];
  icon: keyof typeof icons;
  title: string;
  description: string;
  type: string;
}

export interface Section {
  title: string;
  description: string;
  isSticky: boolean;
  type: string;
}

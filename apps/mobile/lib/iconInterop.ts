import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

const iconComponents = [Ionicons, MaterialCommunityIcons, Entypo];

let isInteropApplied = false;

export function applyIconInterop(): void {
  if (isInteropApplied) return;

  iconComponents.forEach((IconComponent) => {
    cssInterop(IconComponent, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: "color",
        },
      },
    });
  });

  isInteropApplied = true;
}

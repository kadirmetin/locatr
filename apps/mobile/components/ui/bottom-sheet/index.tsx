import type { BottomSheetModal as BSModalType } from "@gorhom/bottom-sheet";
import BottomSheet, {
  BottomSheetModal as BSModal,
  BottomSheetModalProvider,
  BottomSheetScrollView as BSScrollView,
  BottomSheetView as BSView,
} from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";
import React, { forwardRef, Fragment } from "react";

import { BottomSheetProps } from "./types";

const BottomSheetTrigger = Fragment;

type BottomSheetModalType = BSModalType;

const BottomSheetModal = forwardRef<
  BSModal,
  BottomSheetProps & { children: React.ReactNode; isOpen?: boolean }
>(({ children, ...rest }: BottomSheetProps, ref) => {
  return (
    <BSModal ref={ref} {...rest}>
      {children}
    </BSModal>
  );
});

BottomSheetModal.displayName = "BottomSheetModal";

const BottomSheetView = cssInterop(BSView, {
  className: "style",
});

const BottomSheetScrollView = cssInterop(BSScrollView, {
  className: "style",
  contentContainerclassName: "contentContainerStyle",
});

export {
  BottomSheet,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetModalType,
  BottomSheetScrollView,
  BottomSheetTrigger,
  BottomSheetView,
};

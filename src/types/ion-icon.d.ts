import type { DetailedHTMLProps, HTMLAttributes } from "react";

type IonIconProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & { name?: string; size?: string },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}

export {};

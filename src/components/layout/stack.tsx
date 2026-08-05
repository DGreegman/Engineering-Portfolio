/**
 * Stack
 *
 * Vertical spacing helper — ensures consistent gaps between stacked
 * elements (headings, paragraphs, blocks) instead of ad-hoc margins.
 * See docs/09-Component Specification.md ("Stack").
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { STACK_GAP, type StackGap } from "@/lib/constants/layout";

type StackProps = React.HTMLAttributes<HTMLElement> & {
  /** Gap between children. Defaults to a comfortable reading rhythm. */
  gap?: StackGap;
  /** Render as a different element, e.g. "ul" for a list of stacked items. */
  as?: "div" | "ul" | "ol";
};

function Stack({
  gap = "sm",
  as: Tag = "div",
  className,
  ...props
}: StackProps) {
  return (
    <Tag
      data-slot="stack"
      className={cn("flex flex-col", STACK_GAP[gap], className)}
      {...props}
    />
  );
}

export { Stack };

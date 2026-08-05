/**
 * Section
 *
 * Establishes vertical rhythm between page sections and composes the
 * `Container` primitive internally so pages never hand-nest
 * `<section><Container>` themselves. See docs/09-Component
 * Specification.md ("Section" — "Should establish vertical rhythm").
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  SECTION_SPACING,
  type ContentWidth,
  type SectionSpacing,
} from "@/lib/constants/layout";
import { Container } from "@/components/layout/container";

type SectionProps = React.ComponentProps<"section"> & {
  /** Vertical padding step. Defaults to the standard rhythm. */
  spacing?: SectionSpacing;
  /**
   * Inner content width. Pass "full" to opt out of the inner `Container`
   * and control horizontal layout yourself (e.g. full-bleed diagrams).
   */
  width?: ContentWidth;
};

function Section({
  spacing = "md",
  width = "standard",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(SECTION_SPACING[spacing], className)}
      {...props}
    >
      {width === "full" ? (
        children
      ) : (
        <Container width={width}>{children}</Container>
      )}
    </section>
  );
}

export { Section };

/**
 * Container
 *
 * The single width-constraint + centering primitive behind the workspace
 * layout system. `PageContainer`, `ContentContainer`, and `ReadingContainer`
 * are named presets over the same primitive so page authors reach for an
 * intent-revealing name instead of memorizing which `max-w-*` class to use.
 *
 * Horizontal padding is a fixed, responsive gutter (px-4 -> sm:px-6 ->
 * lg:px-8) shared by every width — only the max-width changes between
 * presets. See docs/09-Component Specification.md ("Container") and
 * docs/12-Implementation Roadmap.md (Milestone 2).
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { CONTENT_WIDTH, type ContentWidth } from "@/lib/constants/layout";

type ContainerProps = React.ComponentProps<"div"> & {
  width?: ContentWidth;
};

function Container({
  width = "standard",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      data-width={width}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        CONTENT_WIDTH[width],
        className,
      )}
      {...props}
    />
  );
}

/** Outer page-level chrome rows (e.g. future header/footer content). */
function PageContainer(props: Omit<ContainerProps, "width">) {
  return <Container width="wide" {...props} />;
}

/** Standard body content for documentation-style pages (work, journal, about). */
function ContentContainer(props: Omit<ContainerProps, "width">) {
  return <Container width="standard" {...props} />;
}

/** Long-form reading measure for article and journal entry bodies. */
function ReadingContainer(props: Omit<ContainerProps, "width">) {
  return <Container width="narrow" {...props} />;
}

export { Container, PageContainer, ContentContainer, ReadingContainer };

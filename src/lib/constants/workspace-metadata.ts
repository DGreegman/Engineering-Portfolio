/**
 * Workspace Metadata
 *
 * Lightweight project facts shown in the footer (docs/03-SITEMAP.md's
 * Footer section: "Portfolio version" and similar). Every value here is a
 * static placeholder — no branch, timestamp, or version is computed —
 * per Task 2.5's explicit "do not implement automatic generation."
 *
 * The shape is the point: swapping these for real git/build data later is
 * a data change (edit this array, or pass real `items` into
 * `FooterMetadata`), not a component redesign.
 */

export interface WorkspaceMetadataItem {
  label: string;
  value: string;
}

export const WORKSPACE_METADATA: WorkspaceMetadataItem[] = [
  { label: "Branch", value: "main" },
  { label: "Last updated", value: "—" },
  { label: "Version", value: "0.1.0" },
];

/**
 * Footer
 *
 * The workspace's quiet conclusion: a closing message, a link back into
 * the site (Explore), lightweight project facts (Workspace Metadata), and
 * a few understated ways to get in touch (Connect). Rendered into
 * `WorkspaceLayout`'s `footer` slot (src/components/layout/workspace-layout.tsx),
 * which already supplies the `<footer>` landmark — this component's own
 * root is a plain `div`, same pattern as `Header`.
 *
 * A pure Server Component: unlike Header/Sidebar, footer links never need
 * to reflect the current route, so nothing here needs `NavLink`'s
 * active-state logic or a client boundary.
 *
 * Each section (`FooterClosingMessage`, `FooterExplore`, `FooterMetadata`,
 * `FooterConnect`) is exported individually — independently composable —
 * and also assembled by the default `Footer` export, the same bundling
 * convention `container.tsx` and `ui/card.tsx` already use.
 *
 * See docs/03-SITEMAP.md ("Footer") and docs/07-DESIGN_SYSTEM.md ("Calm
 * Interfaces").
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { Mail, Rss } from "lucide-react";

import { PageContainer } from "@/components/layout/container";
import { Stack } from "@/components/layout/stack";
import { Separator } from "@/components/ui/separator";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { FOOTER_NAVIGATION } from "@/lib/navigation/config";
import { SECTION_SPACING, STACK_GAP } from "@/lib/constants/layout";
import {
  CONTACT_EMAIL,
  FOOTER_CLOSING_MESSAGE,
  GITHUB_URL,
  LINKEDIN_URL,
  SITE_NAME,
} from "@/lib/constants/site";
import {
  WORKSPACE_METADATA,
  type WorkspaceMetadataItem,
} from "@/lib/constants/workspace-metadata";
import { cn } from "@/lib/utils";

/** Shared styling for every real (non-placeholder) footer link. */
const footerLinkClassName =
  "inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

/**
 * Small uppercase-leaning column label — same token Sidebar's group
 * headings use. A real heading (not a styled `<p>`), so screen-reader
 * users navigating by heading can jump straight to each footer section.
 */
function FooterColumnLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-caption text-muted-foreground">{children}</h2>;
}

export function FooterClosingMessage() {
  return (
    <Stack gap="xs">
      {FOOTER_CLOSING_MESSAGE.map((line) => (
        <p key={line} className="text-sm text-muted-foreground">
          {line}
        </p>
      ))}
    </Stack>
  );
}

export function FooterExplore() {
  return (
    <Stack gap="sm">
      <FooterColumnLabel>Explore</FooterColumnLabel>
      <Stack gap="xs" as="ul">
        {FOOTER_NAVIGATION.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={footerLinkClassName}>
              {item.label}
            </Link>
          </li>
        ))}
      </Stack>
    </Stack>
  );
}

export function FooterConnect() {
  return (
    <Stack gap="sm">
      <FooterColumnLabel>Connect</FooterColumnLabel>
      <Stack gap="xs" as="ul">
        <li>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClassName}
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
        </li>
        <li>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClassName}
          >
            <LinkedinIcon className="size-4" />
            LinkedIn
          </a>
        </li>
        <li>
          <a href={`mailto:${CONTACT_EMAIL}`} className={footerLinkClassName}>
            <Mail className="size-4" />
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          {/* Not a link — /rss.xml isn't live yet (Milestone 6). Plain,
              honestly non-interactive text rather than a dead link. */}
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60">
            <Rss className="size-4" />
            RSS <span className="text-xs">(coming soon)</span>
          </span>
        </li>
      </Stack>
    </Stack>
  );
}

function MetadataRow({ label, value }: WorkspaceMetadataItem) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

export function FooterMetadata() {
  return (
    <Stack gap="sm">
      <FooterColumnLabel>Workspace</FooterColumnLabel>
      {/* Each MetadataRow's <div> must be a direct child of <dl> per the
          HTML spec (a div may wrap a dt/dd pair, but dl > div > div > dt/dd
          is not conformant) — so the gap utility is applied to <dl>
          itself rather than via a nested Stack. */}
      <dl className={cn("flex flex-col", STACK_GAP.xs)}>
        {WORKSPACE_METADATA.map((item) => (
          <MetadataRow key={item.label} {...item} />
        ))}
      </dl>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {SITE_NAME}
      </p>
    </Stack>
  );
}

export function Footer() {
  return (
    <div className="border-t border-border">
      {/* Reuses the same vertical-rhythm token Section uses, rather than a
          hand-typed value, so the footer's breathing room keeps scaling at
          lg: the same way the rest of the app's rhythm scale does. */}
      <PageContainer className={SECTION_SPACING.md}>
        <Stack gap="xl">
          <FooterClosingMessage />
          <Separator />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FooterExplore />
            <FooterConnect />
            <FooterMetadata />
          </div>
        </Stack>
      </PageContainer>
    </div>
  );
}

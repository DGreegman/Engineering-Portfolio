/**
 * Contact — "How does someone reach them?" (docs/39 §8/§13, WI-8).
 *
 * The section docs/03-SITEMAP.md explicitly requires here instead of a
 * standalone Contact page. Not a new mechanism — the same three real
 * channels `Footer`'s own `FooterConnect` already surfaces (GitHub,
 * LinkedIn, Email), reusing `lib/constants/site.ts` directly (docs/40 §4's
 * "one fact, one file" — not re-declared as strings in `about-copy.ts`) and
 * the identical external-link attributes `FooterConnect` already
 * establishes as this codebase's pattern for exactly these three link
 * types.
 *
 * No resume link, no scheduling link — neither asset exists in this
 * repository (docs/39 D3). No conditional, no disabled state, no
 * "coming soon" label for either: they are simply absent. No contact form.
 *
 * A Server Component: static content, no interactivity, no client-side
 * state.
 */
import { Mail } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { ABOUT_CONTACT_COPY } from "@/lib/constants/about-copy";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants/site";

const contactLinkClassName =
  "inline-flex items-center gap-1.5 rounded-sm text-body text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

export function Contact() {
  return (
    <Section
      id="contact"
      aria-labelledby="contact-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="sm" className="max-w-reading">
        <h2 id="contact-heading" className="text-h2 text-foreground">
          {ABOUT_CONTACT_COPY.title}
        </h2>
        {ABOUT_CONTACT_COPY.introduction.map((paragraph) => (
          <p
            key={paragraph}
            className="text-body leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}

        <Stack gap="xs" as="ul" className="pt-2">
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClassName}
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
              className={contactLinkClassName}
            >
              <LinkedinIcon className="size-4" />
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={contactLinkClassName}
            >
              <Mail className="size-4" />
              {CONTACT_EMAIL}
            </a>
          </li>
        </Stack>
      </Stack>
    </Section>
  );
}

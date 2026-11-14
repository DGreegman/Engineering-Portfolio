import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { CurrentFocus } from "@/components/home/current-focus";
import { HOW_I_THINK_COPY } from "@/lib/constants/homepage-copy";

export function HowIThink() {
  return (
    <Section
      spacing="md"
      width="full"
      className="border-y border-border/70 bg-secondary/45 px-4 sm:px-6 lg:px-8"
      aria-labelledby="how-i-think-heading"
    >
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] xl:gap-14">
        <div>
          <div className="max-w-prose">
            <p className="font-mono text-caption font-medium uppercase tracking-[0.12em] text-brand-accent">
              Engineering principles
            </p>
            <h2
              id="how-i-think-heading"
              className="mt-3 text-h2 text-foreground"
            >
              {HOW_I_THINK_COPY.title}
            </h2>
            <div className="mt-4 space-y-3">
              {HOW_I_THINK_COPY.introduction.map((paragraph) => (
                <p key={paragraph} className="text-body text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ol className="mt-8 grid gap-x-10 sm:grid-cols-2 sm:gap-y-5">
            {HOW_I_THINK_COPY.principles.map((principle, index) => (
              <li
                key={principle.title}
                className="border-t border-border py-5 first:border-t-0 first:pt-0 sm:first:border-t sm:first:pt-5"
              >
                <p className="font-mono text-caption text-brand-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-h4 text-foreground">
                  {principle.title}
                </h3>
                <Stack gap="xs" className="mt-2">
                  {principle.explanation.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-small leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </Stack>
              </li>
            ))}
          </ol>
        </div>

        <div className="xl:pt-1">
          <CurrentFocus />
        </div>
      </div>
    </Section>
  );
}

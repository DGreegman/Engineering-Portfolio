import { ReadmeHero } from "@/components/home/readme-hero";
import { CurrentFocus } from "@/components/home/current-focus";
import { HowIThink } from "@/components/home/how-i-think";
import { EngineeringNotebook } from "@/components/home/engineering-notebook";
import { EngineeringCaseStudies } from "@/components/home/engineering-case-studies";
import { EngineeringLog } from "@/components/home/engineering-log";
import { BeyondTheCode } from "@/components/home/beyond-the-code";
import { PLACEHOLDER_KNOWLEDGE } from "@/lib/constants/placeholder-knowledge";
import { PLACEHOLDER_WORK } from "@/lib/constants/placeholder-work";
import { PLACEHOLDER_LOG } from "@/lib/constants/placeholder-log";

export default function Home() {
  return (
    <>
      <ReadmeHero />
      <CurrentFocus />
      <HowIThink />
      {/* `articles` is passed in from here, not decided inside the
          component — swapping this for real Knowledge entries later
          (Milestone 3) is a one-line change, not a redesign. */}
      <EngineeringNotebook articles={PLACEHOLDER_KNOWLEDGE} />
      {/* Same data-agnostic pattern: `caseStudies` comes from here, not
          from inside the component. */}
      <EngineeringCaseStudies caseStudies={PLACEHOLDER_WORK} />
      {/* Same pattern again: `entries` comes from here. */}
      <EngineeringLog entries={PLACEHOLDER_LOG} />
      <BeyondTheCode />
    </>
  );
}

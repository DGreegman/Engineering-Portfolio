import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export default function Home() {
  return (
    <Section>
      <Stack gap="xs">
        <h1 className="text-h1">Engineering Portfolio</h1>
        <p className="text-muted-foreground">
          Project initialization complete.
        </p>
      </Stack>
    </Section>
  );
}

import Image from "next/image";

const illustrations = {
  "/work/vaultpay": {
    src: "/images/projects/vaultpay.png",
    alt: "Conceptual illustration of a digital wallet and ledger interface; displayed values are illustrative.",
    width: 1440,
    height: 810,
  },
  "/work/gohunt": {
    src: "/images/projects/gohunt.png",
    alt: "Conceptual illustration of a job matching interface with filters and ranked results; displayed values are illustrative.",
    width: 1440,
    height: 720,
  },
  "/work/haya": {
    src: "/images/projects/haya.png",
    alt: "Conceptual illustration of a website UX review with sample findings and priorities.",
    width: 1440,
    height: 737,
  },
} as const;

/** Supplied project illustration, shared by the homepage, listings, and detail pages. */
export function ProjectDiagram({
  href,
  className = "",
}: {
  href: string;
  className?: string;
}) {
  const illustration = illustrations[href as keyof typeof illustrations];
  if (!illustration) return null;

  return (
    <figure
      className={`mt-5 min-w-0 rounded-lg border border-border/80 bg-background/70 p-3 sm:p-4 ${className}`}
    >
      <Image
        src={illustration.src}
        alt={illustration.alt}
        width={illustration.width}
        height={illustration.height}
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="h-auto w-full rounded-md"
      />
      <figcaption className="mt-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
        Conceptual illustration · interface content and values are illustrative
      </figcaption>
    </figure>
  );
}

import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";

export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/og/engineering-desk.png`,
  width: 1200,
  height: 630,
  alt: "Engineering Desk by Gracious Obeagu, Software Engineer and Technical Lead",
};

type OpenGraphInput = {
  title: string;
  description: string;
  url: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
};

export function createOpenGraphMetadata({
  title,
  description,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  section,
}: OpenGraphInput): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale: "en_US",
    type,
    images: [SOCIAL_IMAGE],
    ...(type === "article"
      ? { publishedTime, modifiedTime, tags, section }
      : {}),
  };
}

export function createTwitterMetadata({
  title,
  description,
}: Pick<OpenGraphInput, "title" | "description">): NonNullable<
  Metadata["twitter"]
> {
  return {
    card: "summary_large_image",
    title,
    description,
    images: { url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt },
  };
}

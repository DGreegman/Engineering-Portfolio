import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

/**
 * Configured MDX render entry point for the content engine. An async
 * Server Component (via next-mdx-remote/rsc) — no client boundary needed
 * unless a future custom component requires one.
 *
 * Not wired into any route yet — no article pages exist in this task. This
 * establishes how MDX will be compiled once one does, with remark-gfm
 * (tables, task lists, strikethrough — content/*.mdx will use these) always
 * enabled. `components` stays caller-supplied and empty by default: the
 * Markdown/Knowledge component library is Milestone 4, not this task.
 */
export function MDXContent({
  source,
  components,
  options,
  ...props
}: MDXRemoteProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        ...options,
        mdxOptions: {
          ...options?.mdxOptions,
          remarkPlugins: [
            remarkGfm,
            ...(options?.mdxOptions?.remarkPlugins ?? []),
          ],
        },
      }}
      {...props}
    />
  );
}

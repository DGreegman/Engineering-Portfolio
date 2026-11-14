"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import { SearchResults } from "@/components/search/search-results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import {
  hasSearchResults,
  searchContent,
  type SearchDocument,
} from "@/lib/content/search";

const EMPTY_INDEX: SearchDocument[] = [];

function subscribeToSearchUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("search-url-change", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("search-url-change", onChange);
  };
}

function getSearchUrl() {
  return window.location.search;
}

function SearchForm({
  query,
  onSubmit,
}: {
  query: string;
  onSubmit: (event: FormEvent<HTMLFormElement>, query: string) => void;
}) {
  const [inputValue, setInputValue] = useState(query);

  return (
    <form
      method="GET"
      action="/search"
      onSubmit={(event) => onSubmit(event, inputValue)}
      className="flex flex-wrap items-center gap-2"
    >
      <label htmlFor="search-query" className="sr-only">
        Search query
      </label>
      <Input
        id="search-query"
        type="search"
        name="q"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        placeholder="Search by title, description, or tag…"
        className="max-w-sm"
      />
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
}

export function SearchPageClient() {
  const search = useSyncExternalStore(
    subscribeToSearchUrl,
    getSearchUrl,
    () => "",
  );
  const query = new URLSearchParams(search).get("q")?.trim() ?? "";
  const [searchIndex, setSearchIndex] = useState<SearchDocument[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error("Search index request failed");
        return response.json() as Promise<SearchDocument[]>;
      })
      .then((index) => {
        if (!cancelled) setSearchIndex(index);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>, value: string) {
    event.preventDefault();
    const submittedQuery = value.trim();

    const nextUrl = new URL(window.location.href);
    if (submittedQuery) nextUrl.searchParams.set("q", submittedQuery);
    else nextUrl.searchParams.delete("q");
    window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
    window.dispatchEvent(new Event("search-url-change"));
  }

  const results = query
    ? searchContent(query, searchIndex ?? EMPTY_INDEX)
    : null;

  return (
    <Section spacing="md" width="full">
      <Stack gap="xl" className="max-w-reading">
        <Stack gap="lg">
          <p className="font-mono text-caption text-muted-foreground">Search</p>
          <h1 className="text-h1 text-foreground">
            Find a page across Knowledge, Work, and Engineering Log.
          </h1>

          <SearchForm key={query} query={query} onSubmit={handleSubmit} />
        </Stack>

        <div aria-live="polite" aria-atomic="true">
          {!query ? (
            <p className="text-body text-muted-foreground">
              Enter a term to search Knowledge, Work, and Engineering Log by
              title, description, or tag.
            </p>
          ) : loadFailed ? (
            <p className="text-body text-muted-foreground">
              Search is temporarily unavailable. Please try again.
            </p>
          ) : searchIndex === null ? (
            <p className="text-body text-muted-foreground">Loading search…</p>
          ) : results && hasSearchResults(results) ? (
            <SearchResults results={results} />
          ) : (
            <p className="text-body text-muted-foreground">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      </Stack>
    </Section>
  );
}

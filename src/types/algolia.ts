/**
 * @see node_modules\.pnpm\instantsearch.js@4.49.4_algoliasearch@4.14.3\node_modules\instantsearch.js\es\types\results.d.ts
 */
export type AlgoliaHit<T> = T & {
  objectID: string; // is always returned by Algolia
  _highlightResult?: HighlightResult;
  _snippetResult?: SnippetResult;
  __position: number;
  __queryID?: string;
};

type MatchLevel = "none" | "partial" | "full";

/**
 * @see https://www.algolia.com/doc/api-reference/widgets/highlight/react-hooks/#widget-param-hit
 */
export type HighlightResult = {
  [attribute: string]: {
    value: string;
    matchLevel: MatchLevel;
    matchedWords: string[];
    fullyHighlighted?: boolean;
  };
};

/**
 * @see https://www.algolia.com/doc/api-reference/widgets/snippet/react-hooks/#widget-param-hit
 */
export type SnippetResult = Pick<HighlightResult, "value" | "matchLevel">;

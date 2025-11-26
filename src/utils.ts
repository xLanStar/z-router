import { DefaultRouterOptions } from "./constants.js";
import type {
  Location,
  ParsedRoute,
  Route,
  RouteMatch,
  RouterOptions,
} from "./types.js";

export const DefaultTransitionDuration = 300;

export const redirect = (options: { to: string; replace?: boolean }) => {
  return new Error("", { cause: options });
};

/**
 * @param pattern pathname pattern like `/users/:id`. Leading and trailing slashes are optional.
 * @param url URL to match against the pattern. Can be href or pathname with query string.
 * @returns extracted params and query if matched, otherwise null
 */
export const matchPattern = (
  pattern: string,
  url: string
): { params: Record<string, string>; query: Record<string, string> } | null => {
  try {
    // 解析 URL
    let pathname, searchParams;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      const urlObj = new URL(url);
      pathname = urlObj.pathname;
      searchParams = urlObj.searchParams;
    } else {
      // 處理相對路徑
      const [path, queryString] = url.split("?");
      if (!path) {
        return null;
      }
      pathname = path;
      searchParams = new URLSearchParams(queryString || "");
    }

    // 移除路徑首尾的斜線以便比較
    const cleanPath = pathname.replaceAll(/^\/|\/$/g, "");
    const cleanPattern = pattern.replaceAll(/^\/|\/$/g, "");

    // 分割路徑段
    const pathSegments = cleanPath.split("/");
    const patternSegments = cleanPattern.split("/");

    // 路徑段數量不同則不匹配
    if (pathSegments.length !== patternSegments.length) {
      return null;
    }

    // 提取路徑參數
    const params: Record<string, string> = {};
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];

      if (patternSegment.startsWith(":")) {
        // 動態參數
        const paramName = patternSegment.slice(1);
        params[paramName] = decodeURIComponent(pathSegment);
      } else if (patternSegment !== pathSegment) {
        // 靜態段不匹配
        return null;
      }
    }

    // 提取查詢參數
    const query = Object.fromEntries(searchParams.entries());

    return { params, query };
  } catch {
    return null;
  }
};

export const matchRoute = (route: ParsedRoute, url: string): RouteMatch => {
  const _matchRoute = (
    matches: ParsedRoute[],
    { children }: ParsedRoute
  ): RouteMatch | null => {
    if (children && children.length > 0) {
      for (const childRoute of children) {
        const matchesResult = _matchRoute([...matches, childRoute], childRoute);
        if (matchesResult) {
          return matchesResult;
        }
      }
      return null;
    }

    const result = matchPattern(buildPathnameFromMatches(matches), url);
    return result ? { matches, ...result } : null;
  };

  return (
    _matchRoute([route], route) || {
      matches: [],
      params: {},
      query: {},
    }
  );
};

export const buildPathnameFromMatches = (matches: Route[]): string => {
  let cleanedPathnames: string[] = []; // pathnames without leading/trailing slashes
  for (const match of matches) {
    if (match.pathname === undefined) continue;
    cleanedPathnames.push(match.pathname.replaceAll(/^\/|\/$/g, ""));
  }
  return "/" + cleanedPathnames.join("/");
};

export const parseLocation = (location: globalThis.Location): Location => ({
  index: 0,
  state: {
    index: 0,
  },
  pathname: location.pathname,
  search: Object.fromEntries(new URLSearchParams(location.search)),
});

export const createRouterOptions = (
  options?: Partial<RouterOptions>
): RouterOptions => ({
  ...DefaultRouterOptions,
  ...options,
});

export const parseRoute = (route: Route): ParsedRoute => {
  const parseRouteRecursive = (route: Route, parentId: string): ParsedRoute => {
    const id =
      route.name ??
      (route.pathname
        ? `${parentId}/${route.pathname.replaceAll(/^\/|\/$/g, "")}`
        : parentId);

    const parsedRoute: ParsedRoute = {
      ...route,
      id,
      children: route.children?.map((child) => parseRouteRecursive(child, id)),
    };

    return parsedRoute;
  };
  return parseRouteRecursive(route, "");
};

const isPathSegmentValid = (segment: string): boolean => segment.length > 0;

/**
 * Resolves a relative path against a base pathname.
 * @param pathname The base pathname.
 * @param to The relative path to resolve.
 * @returns The resolved absolute pathname.
 */
export const resolveRelativePathname = (
  pathname: string,
  to: string
): string => {
  const currentPathSegments = pathname.split("/").filter(isPathSegmentValid);
  const toPathSegments = to.split("/").filter(isPathSegmentValid);
  for (const segment of toPathSegments) {
    if (segment === ".") {
      continue;
    } else if (segment === "..") {
      currentPathSegments.pop();
    } else {
      currentPathSegments.push(segment);
    }
  }
  return "/" + currentPathSegments.join("/");
};

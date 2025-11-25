import { DefaultRouterOptions } from "./constants.js";
import type { Location, Route, RouteMatch, RouterOptions } from "./types.js";

export const DefaultTransitionDuration = 300;

export const redirect = (options: { to: string; replace?: boolean }) => {
  return new Error("", { cause: options });
};

export const matchUrl = (
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

export const matchRoute = (route: Route, url: string): RouteMatch => {
  const _matchRoute = (matches: Route[], route: Route): RouteMatch | null => {
    if (route.children && route.children.length > 0) {
      for (const childRoute of route.children) {
        const matchesResult = _matchRoute([...matches, childRoute], childRoute);
        if (matchesResult) {
          return matchesResult;
        }
      }
      return null;
    }

    const result = matchUrl(buildPathnameFromMatches(matches), url);
    return result ? { matches, ...result } : null;
  };

  return (
    _matchRoute([], route) || {
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

export const parseLocationFromHref = (
  to: string
): Pick<Location, "pathname" | "search"> => {
  const url = new URL(to);
  return {
    pathname: url.pathname,
    search: Object.fromEntries(url.searchParams),
  };
};

export const createRouterOptions = (
  options?: RouterOptions
): RouterOptions => ({
  ...DefaultRouterOptions,
  ...options,
});

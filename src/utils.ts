import type { Location, RootRoute, Route, RouterOptions } from "./types.js";

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

export const matchRoute = (
  rootRoute: RootRoute,
  url: string
): {
  matches: Route[];
  params: Record<string, string>;
  query: Record<string, string>;
} | null => {
  const _matchRoute = (
    matches: Route[],
    route: Route
  ): {
    matches: Route[];
    params: Record<string, string>;
    query: Record<string, string>;
  } | null => {
    if (route.children) {
      for (const childRoute of route.children) {
        const matchesResult = _matchRoute([...matches, childRoute], childRoute);
        if (matchesResult) {
          return matchesResult;
        }
      }
      return null;
    }

    let pattern = "";
    for (const match of matches) {
      if (match.pathname === undefined) continue;
      pattern += `/${match.pathname}`;
    }
    const result = matchUrl(pattern, url);
    if (result) {
      return { matches, ...result };
    }
    return null;
  };

  return _matchRoute([], rootRoute);
};

export const parseLocationFromHref = (
  rootRoute: RootRoute,
  to: string
): Pick<Location, "pathname" | "params" | "query"> | null => {
  const result = matchRoute(rootRoute, to);
  if (!result) return null;
  return {
    pathname: to,
    params: result.params,
    query: result.query,
  };
};

export const createRouter = (options: RouterOptions): RouterOptions => {
  return options;
};

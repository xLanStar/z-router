import { expect, test } from "vitest";

import { matchUrl } from "@/utils.js";

test("Match flat URL", () => {
  expect(matchUrl("/home", "/home")).toEqual({ params: {}, query: {} });
  expect(matchUrl("/home", "home")).toEqual({ params: {}, query: {} });
  expect(matchUrl("home", "/home")).toEqual({ params: {}, query: {} });
  expect(matchUrl("home", "home")).toEqual({ params: {}, query: {} });
  expect(matchUrl("home", "foo")).toEqual(null);
  expect(matchUrl("foo", "home")).toEqual(null);
  expect(matchUrl("foo", "")).toEqual(null);
  expect(matchUrl("", "foo")).toEqual(null);
});

test("Match URL with params", () => {
  expect(matchUrl("/survey/:id/reply", "/survey/123/reply")).toEqual({
    params: { id: "123" },
    query: {},
  });
});

test("Match URL with multiple params", () => {
  expect(
    matchUrl("/survey/:id/reply/:replyId", "/survey/123/reply/456")
  ).toEqual({
    params: { id: "123", replyId: "456" },
    query: {},
  });
});

test("Match URL with query", () => {
  expect(matchUrl("/home", "/home?page=2&sort=asc")).toEqual({
    params: {},
    query: { page: "2", sort: "asc" },
  });
});

test("Match URL with multiple query", () => {
  expect(matchUrl("/home/foo", "/home/foo?page=2&sort=asc")).toEqual({
    params: {},
    query: { page: "2", sort: "asc" },
  });
});

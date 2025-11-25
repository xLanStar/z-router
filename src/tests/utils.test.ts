import { expect, test } from "vitest";

import { matchPattern } from "@/utils.js";

test("Match flat URL", () => {
  expect(matchPattern("/home", "/home")).toEqual({ params: {}, query: {} });
  expect(matchPattern("/home", "/home/")).toEqual({ params: {}, query: {} });
  expect(matchPattern("/home", "home")).toEqual({ params: {}, query: {} });
  expect(matchPattern("home", "/home")).toEqual({ params: {}, query: {} });
  expect(matchPattern("home", "home")).toEqual({ params: {}, query: {} });
});

test("Match URL with params", () => {
  expect(matchPattern("/survey/:id/reply", "/survey/123/reply")).toEqual({
    params: { id: "123" },
    query: {},
  });
});

test("Match URL with multiple params", () => {
  expect(
    matchPattern("/survey/:id/reply/:replyId", "/survey/123/reply/456")
  ).toEqual({
    params: { id: "123", replyId: "456" },
    query: {},
  });
});

test("Match URL with query", () => {
  expect(matchPattern("/home", "/home?page=2&sort=asc")).toEqual({
    params: {},
    query: { page: "2", sort: "asc" },
  });
});

test("Match URL with multiple query", () => {
  expect(matchPattern("/home/foo", "/home/foo?page=2&sort=asc")).toEqual({
    params: {},
    query: { page: "2", sort: "asc" },
  });
});

test("No match for different segment count", () => {
  expect(matchPattern("/home/:id", "/home")).toEqual(null);
  expect(matchPattern("/home", "/home/123")).toEqual(null);
});

test("No match for static segment mismatch", () => {
  expect(matchPattern("/home/about", "/home/contact")).toEqual(null);
  expect(matchPattern("home", "foo")).toEqual(null);
  expect(matchPattern("foo", "home")).toEqual(null);
  expect(matchPattern("foo", "")).toEqual(null);
  expect(matchPattern("", "foo")).toEqual(null);
});

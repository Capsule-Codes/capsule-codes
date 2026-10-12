import { test } from "node:test";
import assert from "node:assert/strict";
import { groupTeamMembers, TEAM_CATEGORY_ORDER } from "./team-groups.ts";

const m = (id: string, category: string, order: number | null = 0) => ({ id, category, order });

test("category order is cofounder, marketing, developer", () => {
  assert.deepEqual([...TEAM_CATEGORY_ORDER], ["cofounder", "marketing", "developer"]);
});

test("groups members by category in display order", () => {
  const groups = groupTeamMembers([
    m("d1", "developer"),
    m("m1", "marketing"),
    m("c1", "cofounder"),
  ]);
  assert.deepEqual(groups.map((g) => g.category), ["cofounder", "marketing", "developer"]);
});

test("omits categories without members (no empty rows)", () => {
  const groups = groupTeamMembers([m("c1", "cofounder"), m("m1", "marketing")]);
  assert.deepEqual(groups.map((g) => g.category), ["cofounder", "marketing"]);
  assert.deepEqual(groupTeamMembers([]), []);
});

test("sorts by order within a category, nulls last, stable", () => {
  const groups = groupTeamMembers([
    m("a", "cofounder", null),
    m("b", "cofounder", 2),
    m("c", "cofounder", 1),
    m("d", "cofounder", 1),
  ]);
  assert.deepEqual(groups[0].members.map((x) => x.id), ["c", "d", "b", "a"]);
});

test("ignores unknown categories", () => {
  const groups = groupTeamMembers([m("x", "intern"), m("c1", "cofounder")]);
  assert.deepEqual(groups.map((g) => g.category), ["cofounder"]);
});

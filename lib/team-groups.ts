export const TEAM_CATEGORY_ORDER = ["cofounder", "marketing", "developer"] as const;

export type TeamCategory = (typeof TEAM_CATEGORY_ORDER)[number];

export interface TeamGroup<T> {
  category: TeamCategory;
  members: T[];
}

/**
 * Groups members into display rows. Rows follow TEAM_CATEGORY_ORDER, categories
 * without members are omitted and unknown categories are ignored. Members are
 * sorted by `order` (nulls last), keeping input order for ties.
 */
export function groupTeamMembers<T extends { category: string; order: number | null }>(
  members: T[],
): TeamGroup<T>[] {
  return TEAM_CATEGORY_ORDER.map((category) => ({
    category,
    members: members
      .filter((m) => m.category === category)
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)),
  })).filter((g) => g.members.length > 0);
}

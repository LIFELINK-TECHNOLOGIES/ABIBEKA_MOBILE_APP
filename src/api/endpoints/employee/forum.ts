export const FORUM = {
  CREATE_POST: "/forum",
  GET_POSTS: "/forum",
  GET_TAGS: "/forum/tags",
  VOTE: (id: string) => `/forum/${id}/vote`,
  DELETE_POST: (id: string) => `/forum/${id}`,
  FLAG: (id: string) => `/forum/${id}/flag`,
  GET_FLAGGED: "/forum/flagged",
  REVIEW: (id: string) => `/forum/${id}/review`,
};

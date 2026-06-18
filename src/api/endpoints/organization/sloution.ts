

export const Solution = {
  GET_SOLUTIONS: "/solution",
  GET_SOLUTION_TAGS: "/solution/tags",
  CREATE_SOLUTION: "/solution",
  VOTE_SOLUTION: (id: string) => `/solution/${id}/vote`,
  PIN_SOLUTION: (id: string) => `/solution/${id}/pin`,
  DELETE_SOLUTION: (id: string) => `/solution/${id}`,
};
export const routerConfig = {
  home: { path: "/" },
  adlib: {
    path: "/adlib/:adlibId",
    execute: ({ id }: { id: number }) => `/adlib/${encodeURIComponent(id)}`,
  },
  adlibPlay: {
    path: "/adlib/:adlibId/play",
    execute: ({ id }: { id: number }) =>
      `/adlib/${encodeURIComponent(id)}/play`,
  },
  create: { path: "/create" },
  browse: { path: "/browse" },
  categories: {
    path: "/categories",
    execute: ({ category }: { category: string }) =>
      `/categories/${encodeURIComponent(category)}`,
  },
  logIn: { path: "/login" },
  signUp: { path: "/signup" },
  logOut: { path: "/logout" },
  saves: { path: "/saves" },
  settings: { path: "/settings" },
};

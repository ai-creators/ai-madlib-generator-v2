export const routerConfig = {
  home: { path: "/" },
  adlibPlay: {
    path: "/adlib/:adlibId/play",
    execute: ({ id }: { id: string }) =>
      `/adlib/${encodeURIComponent(id)}/play`,
  },
  create: { path: "/create" },
  browse: { path: "/browse" },
  categories: { path: "/categories" },
  logIn: { path: "/login" },
  signUp: { path: "/signup" },
  logOut: { path: "/logout" },
  saves: { path: "/saves" },
  settings: { path: "/settings" },
};

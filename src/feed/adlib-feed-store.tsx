import type { RouterOutputs } from "@/trpc/react";
import { FeedOption } from "./feed-option";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { PageRequest } from "@/common/page-request";

type AdlibFeedStoreState = {
  feedOption: FeedOption;
  availableOptions: FeedOption[];
  adlibs: RouterOutputs["adlib"]["getFeed"]["data"];
  pagination: PageRequest;
};

type AdlibFeedStoreActions = {
  setFeedOption: (option: FeedOption) => void;
  appendAdlibs: (items: RouterOutputs["adlib"]["getFeed"]["data"]) => void;
  resetAdlibs: (items: RouterOutputs["adlib"]["getFeed"]["data"]) => void;
  loadMore: () => Promise<void>;
};

export type AdlibFeedStore = AdlibFeedStoreState & AdlibFeedStoreActions;

export const useAdlibFeedStore = create<AdlibFeedStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      feedOption: FeedOption.Latest,
      pagination: {
        page: 1,
        size: 25,
        timestamp: new Date(),
      },
      availableOptions: [FeedOption.Latest, FeedOption.Oldest],
      adlibs: [],
      setFeedOption: (option) =>
        set({
          feedOption: option,
          adlibs: [],
          pagination: { page: 1, size: 25, timestamp: new Date() },
        }),
      appendAdlibs: (items) =>
        set((state) => ({ adlibs: [...state.adlibs, ...items] })),
      resetAdlibs: (items) => set({ adlibs: items }),
      loadMore: async () => {
        set((state) => ({
          pagination: { ...state.pagination, page: state.pagination.page + 1 },
        }));
      },
    })),
  ),
);

import { next as A } from "@automerge/automerge"; //why `next`? See the the "next" section of the conceptual overview

export type ZaikoItem = {
  id: string;
  name: string;
  count: A.Counter;
  link: string;
};

export type ZaikoDoc = {
  zaikoList: ZaikoItem[];
};

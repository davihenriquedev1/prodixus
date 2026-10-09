"use client";

import { useQuery } from "@tanstack/react-query";

import { getTags } from "@/features/tags/services/tag.service";
import { tagQueryKeys } from "./tag.query-keys";

export function useTags() {
  return useQuery({
    queryKey: tagQueryKeys.list(),
    queryFn: getTags,
  });
}

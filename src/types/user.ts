import type { MediaAsset, MediaVariant, User, UserProfile } from "@prisma/client";

export type UserSummarySource = User & {
  profile?: (UserProfile & { avatar?: (MediaAsset & { variants?: MediaVariant[] }) | null }) | null;
};

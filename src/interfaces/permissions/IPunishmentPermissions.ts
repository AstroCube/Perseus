export interface IPunishmentPermissions {
  manage: boolean;
  create: {
    warn: boolean;
    kick: boolean;
    temp_ban: boolean;
    ban: boolean;
    forum_ban: boolean;
  }
}

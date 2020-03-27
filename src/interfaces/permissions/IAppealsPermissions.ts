export interface IAppealsPermissions {
  manage: boolean;
  transactional: {
    comment: string;
    close: string;
    lock: boolean;
    escalate: string;
    appeal: string;
  }
  assign_escalated: boolean;
  view: string;
}

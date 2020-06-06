export interface IAppealsPermissions {
  manage: boolean;
  transactional: {
    comment: IAppealPermissible;
    close: IAppealPermissible;
    lock: boolean;
    escalate: IAppealPermissible;
    appeal: IAppealPermissible;
  }
  assign_escalated: boolean;
  view: IAppealPermissible;
}

export enum IAppealPermissible {
  All = 'All', Involved = 'Involved', Own = 'Own', None = 'None'
}

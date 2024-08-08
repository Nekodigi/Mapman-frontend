export type Status = {
  checkSum: string;
  isArchived: boolean;
  isDeleted: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

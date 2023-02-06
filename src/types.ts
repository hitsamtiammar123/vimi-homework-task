export enum ProductStatus {
  INCOMPLETE = 'INCOMPLETE',
  SHOOTING = 'SHOOTING ',
  EDITING = 'EDITING',
  COMPLETED = 'COMPLETED',
  FEEDBACK = 'FEEDBACK',
}

export interface ProductItem {
  id: string;
  name: string;
  status: ProductStatus;
  type: string;
  createdOn: string;
  archived: boolean;
}

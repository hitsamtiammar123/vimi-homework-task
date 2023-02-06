export enum ProductStatus {
  INCOMPLETE = 'INCOMPLETE',
  SHOOTING = 'SHOOTING ',
  EDITING = 'EDITING',
  COMPLETED = 'COMPLETED',
}

export interface ProductItem {
  id: string;
  name: string;
  status: ProductStatus;
  type: string;
  createdOn: string;
  archived: boolean;
}

export interface IAddress {
  id: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

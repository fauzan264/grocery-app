export interface IAddresssProvince {
  id: string;
  name?: string;
}

export interface IAddressCity {
  id: string;
  name?: string;
}

export interface IAddressDistrict {
  id: string;
  name?: string;
}

export interface IAddress {
  id: string;
  province: IAddresssProvince;
  city: IAddressCity;
  district: IAddressDistrict;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

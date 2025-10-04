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
  provinceId?: string;
  province: IAddresssProvince;
  cityId?: string;
  city: IAddressCity;
  districtId?: string;
  district: IAddressDistrict;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

export interface IStoreProvince {
  id: string;
  name: string;
}

export interface IstoreCity {
  id: string;
  name: string;
}

export interface IstoreDistrict {
  id: string;
  name: string;
}

export interface IStore {
  id?: string;
  name?: string;
  description?: string;
  provinceId?: number;
  province?: IStoreProvince;
  cityId?: number;
  city?: IstoreCity;
  districtId?: number;
  district?: IstoreDistrict;
  address?: string;
  latitude?: string;
  longitude?: string;
  logo?: File | null;
  status?: string;
}

export interface IStoreLocation extends IStore {
  distance?: number;
}

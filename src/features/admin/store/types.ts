export interface IStore {
  id?: string;
  name?: string;
  description?: string;
  provinceId?: number;
  cityId?: number;
  districtId?: number;
  address?: string;
  latitude?: string;
  longitude?: string;
  logo?: File | null;
  status?: string;
}

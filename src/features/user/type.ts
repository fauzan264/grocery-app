export interface IUser {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  photoProfile: File | null;
  verified?: boolean;
  status?: string;
  userRole?: string;
}

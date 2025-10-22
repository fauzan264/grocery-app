import * as yup from "yup";

const maximumFileSize = 1024 * 1024;
const fileFormatAccepted = ["image/jpeg", "image/png", "image/gif"];

export const updateStoreSchema = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  province_id: yup.string(),
  city_id: yup.string(),
  district_id: yup.string(),
  address: yup.string(),
  latitude: yup.string(),
  longitude: yup.string(),
  logo: yup
    .mixed<File>()
    .nullable()
    .test("fileSize", "Maximum file is 1 MB", (file) => {
      if (!file) return true;
      return file.size <= maximumFileSize;
    })
    .test("fileFormat", "Format file not accepted", (file) => {
      if (!file) return true;
      return fileFormatAccepted.includes(file.type);
    }),
});

import * as yup from "yup";

const maximumFileSize = 1024 * 1024;
const fileFormatAccepted = ["image/jpeg", "image/png", "image/gif"];

export const updateUserSchema = yup.object().shape({
  fullName: yup.string(),
  dateOfBirth: yup.date(),
  email: yup.string().email("Invalid email"),
  phoneNumber: yup.string(),
  photoProfile: yup
    .mixed<File>()
    .nullable()
    .test("fileSize", "Maximum file size is 1 MB", (file) => {
      if (!file) return true;
      return file.size <= maximumFileSize;
    })
    .test("fileFormat", "Format file not accepted", (file) => {
      if (!file) return true;
      return fileFormatAccepted.includes(file.type);
    }),
});

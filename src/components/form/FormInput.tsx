import { FormikProps } from "formik";

interface FormInputProps<T> {
  formik: FormikProps<T>;
  name: keyof T;
  label: string;
  type?: string;
  readOnly?: boolean;
}
export default function FormInput<T>({
  formik,
  name,
  label,
  type = "text",
  readOnly = false,
}: FormInputProps<T>) {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend text-slate-800">{label}</legend>
      <label className="input input-accent validator w-full">
        <input
          type={type}
          id={String(name)}
          name={String(name)}
          onChange={formik.handleChange}
          value={(formik.values[name] as string) ?? ""}
          readOnly={readOnly}
        />
      </label>
      {formik.errors[name] && formik.touched[name] && (
        <div className="feedback text-red-600">
          {formik.errors[name] as string}
        </div>
      )}
    </fieldset>
  );
}

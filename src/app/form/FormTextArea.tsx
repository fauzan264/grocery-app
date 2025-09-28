import { FormikProps } from "formik";

interface FormInputTextAreaProps<T> {
  formik: FormikProps<T>;
  name: keyof T;
  label: string;
}

export default function FormInputTextArea<T>({
  formik,
  name,
  label,
}: FormInputTextAreaProps<T>) {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend text-slate-800">{label}</legend>
      <textarea
        className="textarea w-full textarea-accent"
        name={name.toString()}
        placeholder={label}
        onChange={formik.handleChange}
        value={formik.values[name] as string}
      />
      {formik.errors[name] && formik.touched[name] && (
        <div className="feedback text-red-600">
          {formik.errors[name] as string}
        </div>
      )}
    </fieldset>
  );
}

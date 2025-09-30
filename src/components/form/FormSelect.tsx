import { FormikProps } from "formik";

interface Options {
  value: string | number;
  label: string;
}

interface FormSelectProps<T> {
  formik: FormikProps<T>;
  name: keyof T & string;
  label: string;
  options: Options[];
}

export default function FormSelect<T>({
  formik,
  name,
  label,
  options,
}: FormSelectProps<T>) {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend text-slate-800">{label}</legend>
      <select
        name={name.toString()}
        id={name.toString()}
        className="select select-accent validator w-full"
        value={formik.values[name] as string}
        onChange={formik.handleChange}
      >
        <option value={""} disabled={true}>
          Select a {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

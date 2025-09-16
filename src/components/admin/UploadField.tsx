import React from "react";

type Props = {
  accept?: string;
  onChange: (file?: File) => void;
  name?: string;
};

export default function UploadField({ accept = "image/*", onChange, name = "file" }: Props) {
  return (
    <label className="block">
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={(e) => {
          const file = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
          onChange(file);
        }}
        className="mt-1"
      />
    </label>
  );
}

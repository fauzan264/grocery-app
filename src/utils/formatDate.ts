export const formatDateWithTime = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("id-ID", { month: "long" });
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hour}:${minute} WIB`;
};

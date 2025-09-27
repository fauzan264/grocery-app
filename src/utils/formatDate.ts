

export const formatDateWithTime = (isoDate: string): string => {
  const date = new Date(isoDate);

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }) + " WIB";
};

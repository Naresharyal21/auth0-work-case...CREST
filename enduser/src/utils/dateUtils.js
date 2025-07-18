export const utcToLocal = (utcDate) => {
  const date = new Date(utcDate);

  return formatDate(date.toLocaleString());
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",

    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
};

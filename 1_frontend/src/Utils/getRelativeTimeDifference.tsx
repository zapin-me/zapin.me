export function getRelativeTimeDifference(deactivateAt: string): string {
  const now = new Date();
  const deactivateDate = new Date(parseInt(deactivateAt) * 1000); // Assuming UNIX timestamp in seconds
  const diffInMs = deactivateDate.getTime() - now.getTime();

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const seconds = Math.round(diffInMs / 1000);
  const minutes = Math.round(diffInMs / (1000 * 60));
  const hours = Math.round(diffInMs / (1000 * 60 * 60));
  const days = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(days) >= 1) {
    return rtf.format(days, "day");
  } else if (Math.abs(hours) >= 1) {
    return rtf.format(hours, "hour");
  } else if (Math.abs(minutes) >= 1) {
    return rtf.format(minutes, "minute");
  } else {
    return rtf.format(seconds, "second");
  }
}

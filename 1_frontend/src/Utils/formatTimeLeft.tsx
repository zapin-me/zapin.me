export const formatTimeLeft = (timeLeft: any) => {
  let formattedTime = "";

  if (timeLeft.days > 0) {
    formattedTime += `${timeLeft.days}d `;
  }
  if (timeLeft.hours > 0 || timeLeft.days > 0) {
    formattedTime += `${timeLeft.hours}h `;
  }
  if (timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0) {
    formattedTime += `${timeLeft.minutes}m `;
  }
  formattedTime += `${timeLeft.seconds}s`;

  return formattedTime.trim();
};

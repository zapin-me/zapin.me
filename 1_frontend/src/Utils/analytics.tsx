type EventParams = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const sendEvent = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

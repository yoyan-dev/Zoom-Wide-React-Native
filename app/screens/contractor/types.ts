export type ContractorNotification = {
  id: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning";
  dateLabel: string;
};

import axiosInstance from "../config/axios";

interface Report {
  senderId?: string;
  roomId: string;
  timestamp: Date;
  reportType: "like" | "notVibe" | "report";
  reportDescription: string;
}

export const getReportMessages = async (
  roomId: string,
  reportType: "like" | "notVibe" | "report"
) => {
  console.log("#####", reportType);
  const response = await axiosInstance.get(`/reports/${roomId}/messages`, {
    params: { reportType },
  });
  return response.data.data as Report[];
};

export const sendReportMessage = async (
  roomId: string,
  message: string,
  reportType: "like" | "notVibe" | "report"
) => {
  const response = await axiosInstance.post(`/reports/${roomId}/messages`, {
    reportDescription: message,
    reportType: reportType,
  });
  return response.data.data as Report;
};

import { AxiosResponse } from "axios";
import axiosInstance from "../config/axios";
import { Connect } from "../types/connect";

export const connectService = {
  getConnect: async (): Promise<AxiosResponse<Connect>> => {
    const response = await axiosInstance.get("/connect");
    return response;
  },
  updateConnect: async (connect: Connect): Promise<Connect> => {
    const response = await axiosInstance.put("/connect", connect);
    return response.data;
  },
};

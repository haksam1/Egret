"use client";

import axios, { AxiosResponse } from "axios";
 
 
// Dynamically set SERVER_URL based on the current URL
const getServerUrl = () => {
  
    return "http://localhost:8080/";
 
};
 
export const SERVER_URL = getServerUrl();
 
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
 
const httpOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
};
 
const httpOptionsWithOutToken = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
 
const httpOptionsTokenMultWithOutToken = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
 
const httpOptionsMult = {
  headers: {
    Accept: "application/json",  
  },
};

// Helper to handle 401 globally
function handle401(error: any) {
  if (error?.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
 
export const apiService = () => {
  const sendPostToServer = async <T>(url: string, data: any): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.post(SERVER_URL + url, data, httpOptions);
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };
 
  const sendPdfPostToServer = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        ...httpOptions,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendPostToServerPromise = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, httpOptions);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendPostToServerPdf = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        ...httpOptions,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendGetToServer = async <T>(url: string, p0: { id: string | undefined; }): Promise<T> => {
    try {
      const response = await axios.get<T>(SERVER_URL + url, httpOptions);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendPostToServerMult = async (url: string, data: any) => {
    try {
      const response = await axios.post(
        SERVER_URL + url,
        data,
        httpOptionsMult
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendPostToServerMultWithoutToken = async (url: string, data: any) => {
    try {
      const response = await axios.post(
        SERVER_URL + url,
        data,
        httpOptionsTokenMultWithOutToken
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendPostToServerWithOutToken = async (url: string, data: any) => {
    try {
      const response = await axios.post(
        SERVER_URL + url,
        data,
        httpOptionsWithOutToken
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendPostToServerPdfWithoutToken = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: httpOptions.headers,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  const sendRequestToServer = async (controller: string, request: string, data: any):Promise<AxiosResponse> => {
    try {
     
      const response: AxiosResponse  = await axios.post(
        `${SERVER_URL}${controller}/${request}`,
        data
      );
      
      
 
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 
  return {
    sendPostToServer,
    sendGetToServer,
    sendPdfPostToServer,
    sendPostToServerWithOutToken,
    sendPostToServerPdfWithoutToken,
    sendPostToServerPromise,
    sendPostToServerMultWithoutToken,
    sendPostToServerMult,
    sendPostToServerPdf,
    sendRequestToServer,
  };
}; 
export default apiService;


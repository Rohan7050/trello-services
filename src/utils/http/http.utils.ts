import express from "express";
import axios from "axios";
import { ApiError } from "../../core/ApiError";

export const postRequest = async (url: string, postObj: any, res: express.Response, options: any = null) => {
  return new Promise((resolve, _) => {
    axios
      .post(url, postObj, options)
      .then((data) => {
        console.log("API DATA", data.data);
        resolve(data);
      })
      .catch(function (error) {
        console.log("API Error");
        return ApiError.handle(error, res);
      });
  });
};

import express from 'express';
import fs from 'fs';
import moment from 'moment';
import path from 'path';

import { ENABLE_ENCRYPTION } from '../config';
import { User } from '../entities/userEntity';
import { Database } from './../database/database';
import { EncryptionAndDecryption } from './Encryption&Decryption';

export class Logger extends Database {
  constructor(private response: express.Response, private request: express.Request, private statusCode: string, private status: number, private clientResponse: any) {
    super();
    this.createLog();
  }

  private createLog = async () => {
    let user_id: any;
    let user_email: any = '';
    let master_api_id: any = null;
    let api_version_id: any = null;
    console.log("inside the create log function");

    const user: any = this.response.getHeader('user');
    if (!user) {
      const userId: any = EncryptionAndDecryption.decryptionIds(this.request.params.user_id);
      user_id = userId;
      const userData = await User.findOneBy({ id: user_id });
      user_email = userData?.email;
      console.log(this.request.params);
      const masterapiId: any = EncryptionAndDecryption.decryptionIds(this.request.params.api_master_id);
      const vesionId: any = EncryptionAndDecryption.decryptionIds(this.request.params.api_version_id);
      console.log(masterapiId, vesionId);
      master_api_id = masterapiId;
      api_version_id = vesionId;
    } else {
      user_id = user.user_id.id;
      user_email = user.user_id.email;
    }

    // console.log('hostname', this.request.headers);

    let formatted_date = moment(new Date()).format('YYYY-MM-DD kk:mm:ss.SSS');
    let method = this.request.method;
    let url = this.request.url;
    let status = this.statusCode;
    // console.log(this.request.get('host'));
    let fullUrl = this.request.protocol + '://' + (this.request.get('host') || this.request.headers.origin) + this.request.originalUrl;
    // console.log(fullUrl);

    let activityLogDetails: any = {};
    let errorLogDetails: any = {};

    // @ts-ignore
    const duration = Date.now() - +this.response.getHeader('start');
    let log = `[${formatted_date}] ${method}:${url} ${status} ${this.status} ${duration}ms`;

    const { pan = null, mobile = null, email = null } = this.request.headers;

    if (this.status.toString().startsWith('2')) {
      let clientResponseClone = JSON.parse(JSON.stringify(this.clientResponse));
      if (this.clientResponse.hasOwnProperty('data') && ENABLE_ENCRYPTION) {
        clientResponseClone.data = EncryptionAndDecryption.decryption(clientResponseClone.data);
      }

      const transactionsDetails = {
        headers: JSON.stringify(this.request.headers),
        body: this.request.body,
        query: this.request.query,
        response: JSON.stringify(clientResponseClone),
      };

      activityLogDetails = {
        pan,
        mobile,
        email: user_email,
        user_id: user_id,
        master_api_id: master_api_id,
        api_version_id: api_version_id,
        activityDateTime: formatted_date,
        deviceDetails: this.request.ip,
        method,
        endPoint: fullUrl,
        status: +status,
        statusCode: +this.status,
        responseTime: `${duration}ms`,
        transactionsDetails: null,
      };

      await this._saveSuccessLogsToDB(activityLogDetails, this.response)
        .then((suc) => console.log(suc))
        .catch((err) => console.log('error: ', err));

      log += `\n${JSON.stringify(activityLogDetails)}\n-------------------------------`;
    }

    if (!this.status.toString().startsWith('2')) {
      const transactionsDetails = {
        headers: JSON.stringify(this.request.headers),
        body: this.request.body,
        query: this.request.query,
        response: JSON.stringify(this.clientResponse),
      };

      errorLogDetails = {
        pan,
        mobile,
        email: user_email,
        user_id: user_id,
        master_api_id: master_api_id,
        api_version_id: api_version_id,
        activityDateTime: formatted_date,
        deviceDetails: this.request.ip,
        errorMethod: method,
        endPoint: fullUrl,
        errorCode: +status,
        statusCode: +this.status,
        responseTime: `${duration}ms`,
        errorDetails: this.clientResponse.message,
        transactionsDetails: JSON.stringify(transactionsDetails),
      };

      await this._saveErrorLogsToDB(errorLogDetails, this.response)
        .then((suc) => console.log(suc))
        .catch((err) => console.log('error: ', err));

      log += `\n${JSON.stringify(errorLogDetails)}\n-------------------------------`;
    }

    // console.log('errorLogDetails', errorLogDetails)
    // console.log('activityLogDetails', activityLogDetails)

    this.generateLogFile(log, this.status);
  };

  private _saveSuccessLogsToDB = (obj: any, _res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {

        const suburl: any = ['req-log'];
        this.setPGConfig('DB');

        // Check if any suburl in the array is included in the URL
        const includesSuburl = suburl.some((element: any) => this.request.url.includes(element))
        console.log("printing the includesSuburl", includesSuburl);
        

        let query = `INSERT INTO public.activity_logs(
        activity_datetime, user_id, user_email, activity_device_details, method, end_point, status, status_code, response_time, transactions_details )
        VALUES ('${obj.activityDateTime}', ${obj.user_id}, '${obj.email}', '${obj.deviceDetails}', '${obj.method}', '${obj.endPoint}', '${obj.status}', '${obj.statusCode}', '${obj.responseTime}', '${obj.transactionsDetails}');`;
        if (includesSuburl) {
          console.log("inside the if condition");
          
          query = `INSERT INTO public.proxy_activity_logs(
            activity_datetime, master_api_id, api_version_id, user_id, user_email, activity_device_details, method, end_point, status, status_code, response_time )
            VALUES ('${obj.activityDateTime}', ${obj.master_api_id}, ${obj.api_version_id}, ${obj.user_id}, '${obj.email}', '${obj.deviceDetails}', '${obj.method}', '${obj.endPoint}', '${obj.status}', '${obj.statusCode}', '${obj.responseTime}');`;
        }
        console.log('query', query);
        await this.executePGQuery(query);
        console.log(query)
        resolve(true);
      } catch (err: any) {
        console.log(err);
        reject(err);
      }
    });
  };

  private _saveErrorLogsToDB = (obj: any, _res: express.Response) => {
    return new Promise(async (resolve, reject) => {
      try {
        const suburl: any = ['req-log',];
        this.setPGConfig('DB');
        // Check if any suburl in the array is included in the URL
        const includesSuburl = suburl.some((element: any) => this.request.url.includes(element))

        let query = `INSERT INTO public.error_logs(
          activity_datetime, user_id, user_email, activity_device_details, activity_error_method, end_point, acivity_error_code, status_code, response_time, activity_error_details, transaction_details)
        VALUES ('${obj.activityDateTime}', ${obj.user_id}, '${obj.email}', '${obj.deviceDetails}', '${obj.errorMethod}', '${obj.endPoint}', '${obj.errorCode}', '${obj.statusCode}', '${obj.responseTime}', '${obj.errorDetails}', '${obj.transactionsDetails}');`;
        if (includesSuburl) {
          query = `INSERT INTO public.proxy_error_logs(
            activity_datetime, master_api_id, api_version_id, user_id, user_email, activity_device_details, activity_error_method, end_point, acivity_error_code, status_code, response_time, activity_error_details)
          VALUES ('${obj.activityDateTime}', ${obj.master_api_id}, ${obj.api_version_id}, ${obj.user_id}, '${obj.email}', '${obj.deviceDetails}', '${obj.errorMethod}', '${obj.endPoint}', '${obj.errorCode}', '${obj.statusCode}', '${obj.responseTime}', '${obj.errorDetails}');`;
        }

        console.log('query', query);
        await this.executePGQuery(query);

        resolve(true);
      } catch (err: any) {
        reject(err);
      }
    });
  };

  private generateLogFile = (log: string, status: number) => {
    let mainFolder = 'logs';
    let subFolder = status.toString().startsWith('2') ? 'success' : 'error';
    let dir = `${mainFolder}/${subFolder}`;
    let successLogsFileName = `${moment(new Date()).format('YYYY-MM-DD')}-success_logs.log`;
    let errorLogsFileName = `${moment(new Date()).format('YYYY-MM-DD')}-error_log.log`;
    let fileName = status.toString().startsWith('2') ? successLogsFileName : errorLogsFileName;

    if (!dir) dir = path.resolve(`logs/${subFolder}`);

    // create directory if it is not present
    if (!fs.existsSync(mainFolder)) {
      // Create the directory if it does not exist
      fs.mkdirSync(mainFolder);

      // create directory if it is not present
      if (!fs.existsSync(dir)) {
        // Create the directory if it does not exist
        fs.mkdirSync(dir);
      }
    } else {
      // create directory if it is not present
      if (!fs.existsSync(dir)) {
        // Create the directory if it does not exist
        fs.mkdirSync(dir);
      }
    }

    fs.appendFile(`${dir}/${fileName}`, log + '\n', (err) => {
      if (err) console.log(err);
    });
  };
}

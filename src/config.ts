export const ENABLE_ENCRYPTION: boolean = true;
export const PORT = process.env.PORT || 3000;
export const REDIS_PORT = 6379;
export const REDIS_KEY_EXPIRY_TIME = 3600 * 24 * 7; // 7 days
export const PATH = '/api';
export const ENCRYPTION_SECRET_KEY = '';
export const SALT_ROUNDS = 10;
export const projectURL = '';
export const JWT_SECRET_KEY = '';
export const JWT_EXP = 15 * 60; // 15 min
export const JWT_REFRESH_EXP = 1 * 60 * 60; // 1 hours
export const AWS_ACCESS_KEY_ID = '';
export const AWS_SECRET_ACCESS_KEY = '';
export const AWS_REGION = '';
export const AWS_BUCKET = '';
export const cachingAPIs = '';
export const REGEX = {
  PAN: /[A-Z]{3}[P]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}/,
  STRING_CONTAINING_NUMBERS_ONLY: /^\d+$/,
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
};

// Helper code for the API consumer to understand the error and handle is accordingly
export enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
  INVALID_ENCRYPTED_INPUT = '10004',
  INVALID_REFRESH_TOKEN = '10005',
  ACCESS_DENIED = '10006',
}

export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_FOUND = 405,
  INTERNAL_ERROR = 500,
}

export const SERVER_IPS = {
  LOCAL: [`http://localhost:${PORT}`, `localhost:${PORT}`],
  DEV: [`http://localhost:${PORT}`, `localhost:${PORT}`],
  SIT: [],
  UAT: [],
  PROD: [],
};

export enum nonTokenAPIs {
  '/security/saltencryption',
  '/security/encryption',
  '/security/decryption',
}

export const NON_ENCRYPTION_ENDPOINTS = [`${PATH}/security/encryption`, `${PATH}/security/decryption`, `${PATH}/security/saltencryption`];

export const SMTP_DETAILS = {
  UAT: {
    FROM_ADDRESS: '',
    SMTP_HOST: '',
    SMTP_PORT: '',
    SMTP_USER: '',
    SMTP_PASSWORD: '',
    CC: [],
    BCC: [],
  },
  PROD: {
    FROM_ADDRESS: '',
    SMTP_HOST: '',
    SMTP_PORT: '',
    SMTP_USER: '',
    SMTP_PASSWORD: '',
    CC: [],
    BCC: [''],
  },
  DEV: {
    FROM_ADDRESS: '',
    SMTP_HOST: '',
    SMTP_PORT: '',
    SMTP_USER: '',
    SMTP_PASSWORD: '',
    CC: [],
    BCC: [],
  },
};
import { RequestType } from "./types";

export interface CaptchaOTPServerConfig {
  port?: number,
}

export interface CaptchaOTPRequest {
  type: RequestType,
  data?: string,
}

export interface ServerEvents {
  "request server started": (address: string, port: number, request: CaptchaOTPRequest) => void;
  "answer": (answer: string, request: CaptchaOTPRequest) => void;
  "timeout": (request: CaptchaOTPRequest) => void;
}
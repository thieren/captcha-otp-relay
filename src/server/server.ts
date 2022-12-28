import { Server } from 'http';

import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import { TypedEmitter } from 'tiny-typed-emitter';
import { dummyLogger, Logger } from 'ts-log';

import { RequestType } from './types';
import { CaptchaOTPRequest, CaptchaOTPServerConfig, ServerEvents } from './interfaces';
import { AnotherRequestRunning } from './errors';
import { AddressInfo, Socket } from 'net';

const publicDir = __dirname + '/../frontend/public/';

export class CaptchaOTPServer extends TypedEmitter<ServerEvents> {

  private config: CaptchaOTPServerConfig;
  private log: Logger;

  private app: express.Express;
  private server?: Server;
  private allSockets = {};
  private nextSocketId = 0;

  private currentRequest: CaptchaOTPRequest | undefined = undefined;
  private requestTimeout?: NodeJS.Timeout;

  constructor(config: CaptchaOTPServerConfig | undefined = undefined, log: Logger = dummyLogger) {
    super();
    this.log = log;

    this.config = config ?? {};
    this.config.port = this.config.port ?? 8080;

    this.app = express();
    this.app.use(express.static(publicDir));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.get('/captchaData', this.captchaDataRequest.bind(this));
    this.app.get('/closeServer', this.closeServerRequest.bind(this));
    this.app.get('/requestType', this.getRequestType.bind(this));

    this.app.post('/submit', this.submitAnswer.bind(this));
  }

  public async newRequest(type: RequestType, timeout: number = 60, data?: string) : Promise<void> {
    if (!this.noCurrentRequest()) {
      throw new AnotherRequestRunning();
    }

    this.log.debug('New ' + type + ' request.')

    this.currentRequest = {
      type: type,
      data: data,
    }

    if (this.server !== undefined) {
      this.log.debug('Request server still running. Renew...');
      await this.stopServer();
    }

    this.setRequestTimeout(timeout);

    this.server = this.app.listen(this.config.port!, () => {
      const addressInfo = this.server?.address() as AddressInfo;
      this.log.debug('Request server was started on ' + addressInfo.address + ':' + addressInfo.port);
      this.emit("request server started", addressInfo.address, addressInfo.port, this.currentRequest!);
    });

    this.server.on("connection", (socket: Socket) => {
      const socketId = this.nextSocketId++;
      this.allSockets[socketId] = socket;

      socket.on("close", () => {
        delete this.allSockets[socketId];
      });
    });
  }

  private noCurrentRequest(): boolean {
    return (this.currentRequest === undefined);
  }

  private clearRequest(): void {
    if (this.requestTimeout) {
      clearTimeout(this.requestTimeout);
    }
    this.currentRequest = undefined;
  }

  private setRequestTimeout(value: number) {
    if (this.requestTimeout) {
      clearTimeout(this.requestTimeout);
    }

    this.requestTimeout = setTimeout(async () => {
      this.log.debug('Request timed out. Closing request server...');
      await this.stopServer();
      if (this.currentRequest) {
        this.emit("timeout", this.currentRequest);
        this.clearRequest();
      }
    }, value * 1000);
  }

  private async stopServer(): Promise<void> {
    this.log.debug('Closing request server...');
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close(() => {
          this.server = undefined;
          this.log.debug('Request server closed.');
          resolve();
        });
        this.destroyAllSockets();
      } else {
        reject("No server running");
      }
    });
  }

  private destroyAllSockets() {
    for (const socketId in this.allSockets) {
      this.allSockets[socketId].destroy();
    }
  }

  private captchaDataRequest(req: Request, res: Response) {
    if (this.noCurrentRequest() || this.currentRequest?.type !== RequestType.Captcha || this.currentRequest?.data === undefined) {
      res.json({
        error: 'no captcha data',
      });
      return;
    }

    res.json({
      data: this.currentRequest!.data,
    });
  }

  private getRequestType(req: Request, res: Response) {
    if (this.noCurrentRequest()) {
      res.json({
        error: 'no current request',
      });
      return;
    }

    res.json({
      type: this.currentRequest?.type,
    });
  }

  private submitAnswer(req: Request, res: Response) {

    if (req.body && req.body.answer && this.currentRequest) {
      this.log.debug('answer submitted');
      this.emit("answer", req.body.answer, this.currentRequest);
      this.clearRequest();
    }
    
    res.redirect('/');
  }

  private async closeServerRequest(req: Request, res: Response) {
    res.send('ok');
    await this.stopServer();
  }
}
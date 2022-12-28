# captcha-otp-relay

If you have a headless service that might require occasional captcha or OTP (One-Time-Password) inputs from a user this library might help.

In case that your service has no option to let the user interact directly (e.g. enter the captcha phrase) you can relay these requests. This library will start a webservice on a new request that your user can access. This will show an option to enter the captcha / OTP.

## Example use case

I am using this in a [homebridge](https://homebridge.io) plugin. This plugin logs into a third party account which might require a captcha or OTP input from the user. Since the plugin itself runs in the homebridge instance there is no direct way to let the user input anything. Hence the need for this library.

## Limitations

For now this is modeled for the very specific use case described above. Hence there are a few limitations which I might conquer if the need for it is expressed (feel free to open an issue).

- Only one captcha / OTP request can be handled at any given time
- UI appearance is not customizable for now
- Captcha Images are only supported as image blobs (no urls)

## How to use (Typescript example)

```
import { CaptchaOTPServer, RequestType, CaptchaOTPRequest } from "captcha-otp-relay";

const relay = new CaptchaOTPServer();

relay.on("answer", (answer: string, request: CaptchaOTPRequest) => {
  console.log('request answer: ' + answer);
});

relay.newRequest(RequestType.OTP);
```

type RandomCodeSettings = {
  length?: number;
  useNumbers?: boolean;
  useAlphanumeric?: boolean;
  userSpecialChars?: boolean;
};

export class Helpers {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomCode = (randomCodeSettings?: RandomCodeSettings) => {
    const defaultSettings: RandomCodeSettings = {
      length: 6,
      useAlphanumeric: true,
      useNumbers: true,
      userSpecialChars: true
    };

    const settings = {
      ...defaultSettings,
      ...randomCodeSettings
    };

    let text = "";
    const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!-_?#&%/{}()";

    var possible = "";

    if (settings.useNumbers) {
      possible += numbers;
    }

    if (settings.useAlphanumeric) {
      possible += alphanumericChars;
    }

    if (settings.userSpecialChars) {
      possible += specialChars;
    }

    for (var i = 0; i < settings.length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  static getIp = (request: any) => {
    return request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  };
}

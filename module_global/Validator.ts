import axios from 'axios';

export default class Validator {
  async validateOriginalLink(origLink : string) {
    try {
      await axios.head(origLink);
    } catch(err) {
      throw new Error('Invalid link');
    }
  }
  validateLifetime(timeToLive : string) : number | null {
    let lowerCaseTime : string = timeToLive.toLowerCase();
    let seconds = Math.round(Date.now() / 1000);
    const SECONDS_IN_A_DAY = 86400;
    switch (lowerCaseTime) {
      case '1d':
        return seconds + SECONDS_IN_A_DAY;
      case '3d':
        return seconds + (3 * SECONDS_IN_A_DAY);
      case '7d':
        return seconds + (7 * SECONDS_IN_A_DAY);
      case 'one-time':
        return null;
      default:
        throw new Error('Invalid lifetime');
    }

  }
}
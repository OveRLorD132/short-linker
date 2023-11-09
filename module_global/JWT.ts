import jwt, { DecodeOptions, JwtPayload, Secret } from 'jsonwebtoken';

import RefreshTokens from './DB_Classes/RefreshTokens';

let refreshTokensTable = new RefreshTokens();

export default class JWT {
  private async verifyToken(token : string) : Promise<string | JwtPayload |  undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY as Secret, (err, decoded) => {
        if(err) reject(err);
        else resolve(decoded);
      });
    })
  }
  async generateToken(profile : UserProfile) : Promise<AuthTokens> { 
    let accessToken = jwt.sign(profile, process.env.SECRET_KEY as Secret, { 
      expiresIn: process.env.ACCESS_KEY_TTL
    })
    let refreshToken = jwt.sign(profile, process.env.SECRET_KEY as Secret);
    await refreshTokensTable.addToken(profile.userId, refreshToken);
    return { refreshToken, accessToken };
  }
  async checkToken(token : string) : Promise<UserProfile> {
    try {
      let decoded : string | JwtPayload | undefined = await this.verifyToken(token);
      return decoded as UserProfile;
    } catch(err) {
      throw err;
    }
  }
  async tokenRefresh(refreshToken : string) : Promise<AuthTokens> {
    try {
      let userProfile : UserProfile = await this.checkToken(refreshToken);
      let tokenInfo : TokenInfo = await refreshTokensTable.getToken(userProfile.userId);
      if(tokenInfo.token !== refreshToken) throw new Error('Invalid Token');
      let newTokens : AuthTokens = await this.generateToken(userProfile);
      await refreshTokensTable.addToken(userProfile.userId, newTokens.refreshToken);
      return newTokens;
    } catch(err) {
      throw err;
    }
  }
}
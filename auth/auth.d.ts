interface AuthRequest {
  email : string;
  password : string;
}

interface AuthenticationResponse {
  success : boolean;
  data? : AuthTokens;
  error? : string;
}

interface UserProfile {
  userId : string;
  email : string;
  password : string;
  iat?: number | undefined;
}

interface UserInsertParams {
  TableName : string | undefined;
  Item : UserProfile;
}

interface ScanTableParams {
  TableName : string | undefined;
}

interface AuthTokens {
  accessToken: string;
  refreshToken : string;
}

interface TokenInfo {
  userId : string;
  token : string;
}
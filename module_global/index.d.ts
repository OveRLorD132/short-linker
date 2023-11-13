interface ShortLinkData {
  linkId : string;
  userId? : string;
  origLink : string;
  timeToLive? : number;
  isOneTimeLink? : boolean;
}
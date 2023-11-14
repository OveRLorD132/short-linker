interface ShortLinkData {
  linkId : string;
  userId? : string;
  origLink : string;
  visits : number;
  timeToLive? : number;
  isOneTimeLink? : boolean;
}
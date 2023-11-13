import formatQueryObject from './format-query-object';

export default function formatLinksList(linksList : Array<ShortLinkData>) : Array<ShortLinkData> {
  return linksList.map((elem) => { 
    elem = formatQueryObject(elem) as ShortLinkData;
    delete elem.userId;
    return elem;
  });
}
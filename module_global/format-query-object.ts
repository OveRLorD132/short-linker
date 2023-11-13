export default function formatQueryObject(obj : Object) : Object {
  let types = ['S', 'BOOL', 'N'];
  for(let key in obj) {
    for(let objType of types) {
      if(obj[key][objType]) obj[key] = obj[key][objType];
    }
  }
  return obj;
}
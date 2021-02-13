export const getIdFromResourceUri = (uri: string): string =>
  uri.split('/').slice(-2, -1)[0];

export const getRandomArrElem = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

export const deleteIrrelevantProperties = (obj: any) => {
  delete obj.created;
  delete obj.edited;
  delete obj.url;
}
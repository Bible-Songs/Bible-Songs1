import {APP_VERSION} from './version';

const releases='https://github.com/Bible-Songs/Bible-Songs1/releases/download/';
const audioRelease=releases+'audio-1.0.114/';
// Revised recordings get a new release URL; the 1.0.114 assets stay for clients on older versions.
const revisedLibraryAudio:ReadonlyMap<string,string>=new Map([
 'gods-jewels-spurgeon','immutability-of-god-spurgeon','compel-them-to-come-in-spurgeon',
 'payday-someday-rg-lee','sinners-in-the-hands-of-an-angry-god-edwards',
].flatMap(stem=>['m4a','mp3'].map(ext=>[`${stem}.${ext}`,releases+'audio-1.0.115/'] as const)));

export function mediaUrl(path:string){
 const libraryAudio=/^library\/[^/]+\.(m4a|mp3)$/.test(path);
 const bibleAudio=/^readings\/(luke|romans)-\d+\/[^/]+\.m4a$/.test(path);
 const url=libraryAudio
  ?(revisedLibraryAudio.get(path.slice('library/'.length))??audioRelease)+encodeURIComponent(path.slice('library/'.length))
  :bibleAudio
   ?audioRelease+encodeURIComponent(path.replaceAll('/','--'))
   :import.meta.env.BASE_URL+path;
 return `${url}?v=${APP_VERSION}`;
}

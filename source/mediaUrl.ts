import {APP_VERSION} from './version';

const audioRelease='https://github.com/Bible-Songs/Bible-Songs1/releases/download/audio-1.0.114/';

export function mediaUrl(path:string){
 const libraryAudio=/^library\/[^/]+\.(m4a|mp3)$/.test(path);
 const bibleAudio=/^readings\/(luke|romans)-\d+\/[^/]+\.m4a$/.test(path);
 const url=libraryAudio
  ?audioRelease+encodeURIComponent(path.slice('library/'.length))
  :bibleAudio
   ?audioRelease+encodeURIComponent(path.replaceAll('/','--'))
   :import.meta.env.BASE_URL+path;
 return `${url}?v=${APP_VERSION}`;
}

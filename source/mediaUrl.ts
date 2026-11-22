import {APP_VERSION} from './version';

const releases='https://github.com/Bible-Songs/Bible-Songs1/releases/download/';
const audioRelease=releases+'audio-1.0.114/';
// Revised recordings get a new release URL so cached pages never pair new audio with old cue timings.
// Each sermon's current recording, by the release that holds it (newest wins).
const libraryReleases:readonly (readonly [string,readonly string[]])[]=[
 ['audio-1.0.115',['sinners-in-the-hands-of-an-angry-god-edwards']],
 ['audio-1.0.118',['payday-someday-rg-lee']],
 ['audio-1.0.124',['gods-jewels-spurgeon','immutability-of-god-spurgeon','compel-them-to-come-in-spurgeon','christ-crucified-spurgeon','prayer-the-cure-for-care-spurgeon']],
 ['audio-1.0.130',['free-grace-wesley']],
 ['audio-1.0.131',['way-of-salvation-spurgeon']],
 ['audio-1.0.136',['bruised-reed-sibbes']],
 ['audio-1.0.135',['nature-of-true-virtue-edwards']],
];
const revisedLibraryAudio:ReadonlyMap<string,string>=new Map(libraryReleases.flatMap(([tag,stems])=>
 stems.flatMap(stem=>['m4a','mp3'].map(ext=>[`${stem}.${ext}`,releases+tag+'/'] as const))));

export function mediaUrl(path:string){
 const libraryVideo=path==='library/prayer-the-cure-for-care-spurgeon.mp4';
 const libraryAudio=/^library\/[^/]+\.(m4a|mp3)$/.test(path);
 const bibleAudio=/^readings\/(luke|romans)-\d+\/[^/]+\.m4a$/.test(path);
 const url=libraryVideo
  ?releases+'video-1.0.125/'+encodeURIComponent(path.slice('library/'.length))
  :libraryAudio
  ?(revisedLibraryAudio.get(path.slice('library/'.length))??audioRelease)+encodeURIComponent(path.slice('library/'.length))
  :bibleAudio
   ?audioRelease+encodeURIComponent(path.replaceAll('/','--'))
   :import.meta.env.BASE_URL+path;
 return `${url}?v=${APP_VERSION}`;
}

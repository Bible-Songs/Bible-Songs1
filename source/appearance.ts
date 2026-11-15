import {useEffect,useState} from 'react';

export const themes=['Auto','Light','Dark'] as const;
export const layouts=['Desktop','Mobile'] as const;
type Theme=(typeof themes)[number];
type Layout=(typeof layouts)[number];
const darkPreference='(prefers-color-scheme: dark)';
function localChoice<T extends string>(key:string,choices:readonly T[]):T|undefined{
 try{
  const value=localStorage.getItem(key);
  return choices.find(choice=>choice===value);
 }catch{return undefined;}
}
export function useAppearance(key:string){
 const [theme,setTheme]=useState<Theme>(()=>localChoice(key+':theme',themes)??'Auto');
 const [layout,setLayout]=useState<Layout|undefined>(()=>localChoice(key+':layout',layouts));
 const [systemDark,setSystemDark]=useState(()=>window.matchMedia(darkPreference).matches);
 useEffect(()=>{
  const media=window.matchMedia(darkPreference);
  const change=(event:MediaQueryListEvent)=>setSystemDark(event.matches);
  media.addEventListener('change',change);
  return ()=>media.removeEventListener('change',change);
 },[]);
 useEffect(()=>{
  try{
   localStorage.setItem(key+':theme',theme);
   if(layout)localStorage.setItem(key+':layout',layout);
   else localStorage.removeItem(key+':layout');
  }catch{}
 },[key,layout,theme]);
 return {theme,setTheme,dark:theme==='Dark'||(theme==='Auto'&&systemDark),layout,setLayout};
}

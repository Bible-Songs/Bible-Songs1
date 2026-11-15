const speeds=[.5,.8,1,1.2,1.5,2];
export default function PlaybackSpeed({speed,onChange}:{speed:number;onChange:(speed:number)=>void}){
 return <select className="playback-speed" aria-label="Playback speed" value={speed}
  onChange={event=>onChange(Number(event.target.value))}>
  {speeds.map(value=><option key={value} value={value}>{value}×</option>)}
 </select>;
}

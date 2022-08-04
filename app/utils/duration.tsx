export const convertDurationToString = (duration)=>{
  const h = Math.floor(duration / 60);
  const  m = Math.floor(duration % 60 );
  return `${h} hrs and ${m} minutes`
}
export const convertDurationToInputString = (duration)=>{
  const h = Math.floor(duration / 60).toString();
  const  m = Math.floor(duration % 60 ).toString();
  const hoursFinal = h?.length<2? `0${h}`:h
  const minutesFinal = m?.length<2? `0${m}`:m
  return `${hoursFinal}:${minutesFinal}`
}

export const convertDurationStringToMinutes = (dString:string)=>{
  const d = dString?.split(":");
  const  h = parseInt(d[0]);
  const m = parseInt(d[1]);
  const finalMinutes = h*60+m
  return finalMinutes
}

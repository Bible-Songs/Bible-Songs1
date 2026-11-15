export type SavedAudio={text:string;chunks:{index:number;blob:Blob}[]};
export async function savedAudio<T>(mode:IDBTransactionMode, operation:(store:IDBObjectStore)=>IDBRequest<T>){
 const database=await new Promise<IDBDatabase>((resolve,reject)=>{
  const request=indexedDB.open('bible-songs-listening-audio',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('readings');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
 try{
  return await new Promise<T>((resolve,reject)=>{
   const transaction=database.transaction('readings',mode);
   const request=operation(transaction.objectStore('readings'));
   transaction.oncomplete=()=>resolve(request.result);
   transaction.onabort=()=>reject(transaction.error);
  });
 }finally{database.close();}
}

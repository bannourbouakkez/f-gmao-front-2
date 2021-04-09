

/*
export class Replace  {
 replace (module:string,type:string,word:string){
 if(module=='correctif' && type=='type_di'){
    switch (word) {
        case 'electrique':return 'Eléctrique';break;
        case 'mecanique':return 'Mécanique';break;
        default:return word;break;
    }
 }

}
}
*/

function replace_ (module:string,type:string,word:string|number){
    console.log('test rep');
    if(module=='correctif' && type=='type_di'){
       switch (word) {
           case 'electrique':return 'Eléctrique';break;
           case 'mecanique':return 'Mécanique';break;
           default:return word;break;
       }
    }
   
   }

export { replace_ as replace_ }




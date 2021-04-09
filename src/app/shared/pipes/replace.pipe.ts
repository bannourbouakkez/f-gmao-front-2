import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(args[0]=='type_di'){
      switch (value) {
          case 'electrique':return 'Eléctrique';break;
          case 'mecanique':return 'Mécanique';break;
          default:return value;break;
      }
   }
   
  }

}

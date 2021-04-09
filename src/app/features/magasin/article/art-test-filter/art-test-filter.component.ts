import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { FieldConfig } from 'src/app/features/material/field.interface';
import { DynamicFormComponent } from 'src/app/features/material/components/dynamic-form/dynamic-form.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-art-test-filter',
  templateUrl: './art-test-filter.component.html',
  styleUrls: ['./art-test-filter.component.scss']
})
export class ArtTestFilterComponent implements OnInit {

  regConfig: FieldConfig[]=[];
  CaraFilter;
  isDynamic=false;
  isValid=false;

@ViewChild(DynamicFormComponent,{static:true}) form: DynamicFormComponent; 
eventsSubject: Subject<void> = new Subject<void>();
emitEventToChild(res) {
  this.eventsSubject.next(res);
}

  constructor(private articleService:ArticleService) { }

  ngOnInit() {
    this.getForm(34);
  }

  submit(value: any) { this.CaraFilter=value; this.isDynamic=true;}
  isValidFunc(value : any){ this.isValid=value;}

  getForm(FamCaraID:number){
    this.articleService.getformFilter(FamCaraID).then(
      res=>{
       this.regConfig=res as FieldConfig[];
       this.CaraFilter=this.regConfig;
       console.log(res);
      },
      err=>console.log('ArtTestFilterComponent:getForm',err)
    );
   }

consoleCaraFilter(){
  console.log(this.CaraFilter);
}


}

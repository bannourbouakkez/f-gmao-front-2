import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DiService } from '../../services/di.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-corr-di-plan',
  templateUrl: './corr-di-plan.component.html',
  styleUrls: ['./corr-di-plan.component.scss']
})
export class CorrDiPlanComponent implements OnInit {

  LoadingReactBtn1=false;
  planloaded=false;


  DiID:number=0;
  PlanID:number=0;
  form:FormGroup;
  constructor(private _currentRoute: ActivatedRoute,private fb:FormBuilder,private diService:DiService,
              public dialogRef: MatDialogRef<CorrDiPlanComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
              ,private _notification: MessageService) { }

  ngOnInit(){

    if(this.data){
      let DiID = this.data.DiID;
      let PlanID = this.data.PlanID;
      if(DiID>0){ this.DiID=DiID; }
      if(PlanID>0){ this.PlanID=PlanID; }
      this.formInit();

      if(PlanID>0){this.getPlan(PlanID);}
    }

  }

  formInit(){
    this.form=this.fb.group({
      DiID:[this.DiID],
      date:['',Validators.required],
      time:['',Validators.required],
      type:['auto',Validators.required]
    });
  }

  planifierDi(form:FormGroup){
  
    if(this.form.valid){
      if(!this.LoadingReactBtn1){
        this.LoadingReactBtn1=true;
    this.diService.planifierDi(this.PlanID,form.value).then(
      res=>{
        //console.log('res of planifierDi of CorrDiPlanComponent:'+res);
        if(res.PlanID>0){
           this.notification('success', "Di est planifiée avec succées .", 2000);
           this.dialogRef.close(res);
          }else{
            this.notification('danger', "Error .", 2000);
            this.dialogRef.close(false);
          }

      },
      err=>console.log(err)
    );
    }
    }else{
      this.notification('danger', "Formulaire non complet .", 1500);
    }

  }
  

  getPlan(PlanID:number){
    //console.log('get Plan : '+PlanID);
    this.diService.getPlan(PlanID).then(
      res=>{
        console.log(res);
        this.form.patchValue({date:res.date});
        this.form.patchValue({time:res.datetime});
        this.form.patchValue({type:res.type});
        this.planloaded=true;
      },
      err=>console.log(err)
    );
  }


  // ------ Notification & Redirection  --------------
  notification(type: string, msg: string, duree: number) {
    // type : primary , success , danger 
    this._notification.create(
      type,
      msg,
      {
        Position: "top-right",
        Style: "simple",
        Duration: duree
      }
    );
  }
//###################################################


}

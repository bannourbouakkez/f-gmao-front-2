import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiService } from '../../services/di.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrevPlanComponent } from 'src/app/features/preventif/plan/prev-plan/prev-plan.component';
import { CorrDiPlanComponent } from '../corr-di-plan/corr-di-plan.component';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-corr-di-aff',
  templateUrl: './corr-di-aff.component.html',
  styleUrls: ['./corr-di-aff.component.scss']
})
export class CorrDiAffComponent implements OnInit {

   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/correctif/di/add/0',title:'Ajouter DI'}
    ,{url:'gmao/correctif/di/dis',title:'Liste DIs'}
    //,{url:'gmao/preventif/plans/list',title:'Liste interventions planifiées'}
    ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/di',title:'DI'},
    {url:'#',title:'Affichage DI'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  //###############################
  OtID=0;

  DiID:number=0;
  di:any;
  plan:any;
  niveaux=<any>[];

  GetFiles=false;
  constructor(private _currentRoute: ActivatedRoute,private diService:DiService,
    public dialogRef: MatDialogRef<PrevPlanComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
    ,private matDialog: MatDialog,private _notification: MessageService) { }

  ngOnInit() {

    let DiID = +this._currentRoute.snapshot.paramMap.get('id');
    if(!DiID){ DiID=this.data;}
    if(DiID>0){ this.getDiForAffichage(DiID); }

    //this.getDiForAffichage(DiID);
  }

  getDiForAffichage(DiID:number){
    this.diService.getDiForAffichage(DiID).then(
      res=>{
        console.log(res);
        this.DiID=res.di.DiID;
        this.di=res.di;

        this.niveaux=res.niveaux;
        this.OtID=res.OtID;
        this.plan=res.plan;

        this.GetFiles=true;
      },
      err=>console.log(err)
    );
  }

  deleteDi(DiID:number){
    if(this.LoadingReactBtn1==false){
      this.LoadingReactBtn1=true;
      
      
      this.diService.deleteDi(DiID).then(
        res=>{
          
          console.log(res);
          if(res.success){
            this.notification('success',res.msg, 3000);
          }else{
            this.notification('danger',res.msg, 3000);
          }
          this.LoadingReactBtn1=false;
          //location.reload();
          this.DiID=0;
          this.ngOnInit();

        },
        err=>console.log(err)
      );
      

     }

  }


  planifierDi(PlanID:number,DiID:number){
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data={PlanID,DiID};
    this.matDialog.open(CorrDiPlanComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if( res != undefined && res!=null  ){
        //console.log(res);
        //console.log('res of planifierDi of CorrDiListComponent:'+res);
        //this.ChangerStatutAddIDAfterAction(res.PlanID,DiID,'planifie');

        this.DiID=0;
        this.ngOnInit();
      }
    });

}

deplanifierDi(PlanID:number){
  this.diService.deplanifierDi(PlanID).then(
    res=>{ 

      if(res.success){
        this.notification('success',res.msg, 3000);
      }else{
        this.notification('danger',res.msg, 3000);
      }
        this.DiID=0;
        this.ngOnInit();
     },
    err=>console.log(err)
  );
}


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



}

import { Component, OnInit, Optional, Inject } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-prev-plan',
  templateUrl: './prev-plan.component.html',
  styleUrls: ['./prev-plan.component.scss']
})
export class PrevPlanComponent implements OnInit {

  //---------- breadcrumb ---------
  autres=[ 
    //,{url:'gmao/preventif/intervention/interventions',title:'Liste interventions'}
    {url:'gmao/preventif/plans/list',title:'Liste interventions planifiées'},
    {url:'gmao/preventif/plans/ipcalender',title:"Calendrier"}
    ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/plan',title:'plan'},
    {url:'',title:'Affichage Plan'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  //###############################

  InterventionID:number=0;
  intervention:any;
  niveaux=<any>[];
  constructor(private interventionService:InterventionService,private _currentRoute: ActivatedRoute
    ,public dialogRef: MatDialogRef<PrevPlanComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    var InterventionID = +this._currentRoute.snapshot.paramMap.get('id');
    if(!InterventionID){ InterventionID=this.data;}
    if(InterventionID>0){ this.getIntervention(InterventionID); }
  }
  
  getIntervention(InterventionID:number){  
    this.interventionService.getIntervention(InterventionID).then(
      res=>{
        console.log(res);
        this.intervention=res.intervention;
        this.niveaux=res.niveaux;
        this.InterventionID=res.intervention.InterventionID;
        //this.loaded=true;  
      },
      err=>console.log(err)
    );
   }

}

import { Component, OnInit } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prev-intervention',
  templateUrl: './prev-intervention.component.html',
  styleUrls: ['./prev-intervention.component.scss']
})
export class PrevInterventionComponent implements OnInit {

  
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ,{url:'gmao/preventif/intervention/interventions',title:'Liste interventions'}
    //,{url:'gmao/preventif/plans/list',title:'Liste interventions planifiées'}
    ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/intervention',title:'intervention'},
    {url:'gmao/preventif/intervention/addoredit',title:'Affichage intervention'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  //###############################

  InterventionID:number=0;
  intervention:any;
  niveaux=<any>[];
  constructor(private interventionService:InterventionService,private _currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let InterventionID = +this._currentRoute.snapshot.paramMap.get('id');
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

   deleteIntervention(InterventionID:number){
    if(this.LoadingReactBtn1==false){
    this.LoadingReactBtn1=true;
    this.interventionService.deleteIntervention(InterventionID).then(
      res=>{
        console.log(res);
        this.LoadingReactBtn1=false;
        //location.reload();
        this.ngOnInit();
      },
      err=>console.log(err)
    );
   }
  }
   

   

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OutilService } from '../../services/outil.service';

@Component({
  selector: 'app-mag-utilisation-aff',
  templateUrl: './mag-utilisation-aff.component.html',
  styleUrls: ['./mag-utilisation-aff.component.scss']
})
export class MagUtilisationAffComponent implements OnInit {

  UseID:number;
  use:any;
  duree:number=0;
  isDeleted=true;
  constructor(private outilService:OutilService,private _currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let UseID = +this._currentRoute.snapshot.paramMap.get('id');
    if(UseID>0){
      this.UseID=UseID;
      let source='affichage';
      this.outilService.getUseAndTables(UseID,source).then(
        res=>{
        this.use=res.use;
        this.duree=res.duree;
        this.isDeleted=res.isDeleted;
        },
        err=>console.log(err)
      );
      }
  }

  Cloture(){
  this.outilService.Cloture(this.UseID).then(
   res=>console.log(res),
   err=>console.log(err)
  );
  }

  deleteUse(){
    this.outilService.deleteUse(this.UseID).then(
      res=>console.log(res),
      err=>console.log(err)
     );
  }
  
  dureeFunc(NbMin:number){
   let NbDeJours=NbMin/1440; NbDeJours=Math.trunc(NbDeJours);
   NbMin=NbMin - ( NbDeJours * 1440);
   let NbDeHeures=NbMin/60; NbDeHeures=Math.trunc(NbDeHeures);
   NbMin=NbMin - ( NbDeHeures * 60);
   let duree='';
   if(NbDeJours>0){duree+=NbDeJours+' Jour(s) et '}
   if(NbDeHeures>0){duree+=NbDeHeures+' Heure(s) et '}
   duree+=NbMin+' Miniute(s)';
   return duree;
  } 

  


}

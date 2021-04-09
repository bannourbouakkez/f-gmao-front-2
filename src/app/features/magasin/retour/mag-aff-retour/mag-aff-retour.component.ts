import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MagRetourService } from '../../services/mag-retour.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MagRetourAddComponent } from '../mag-retour-add/mag-retour-add.component';

@Component({
  selector: 'app-mag-aff-retour',
  templateUrl: './mag-aff-retour.component.html',
  styleUrls: ['./mag-aff-retour.component.scss']
})
export class MagAffRetourComponent implements OnInit {

    //---------- breadcrumb ---------
    autres=[ 
      {url:'gmao/magasin/retour/retours',title:'Liste retours'}
      ];
    breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/magasin',title:'magasin'} ,
      {url:'gmao/magasin/retour',title:'intervention'},
      {url:'',title:'Affichage Retour'}
    ];
    lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
    LoadingReactBtn1=false;
    //###############################


  RetourID:number=0;
  retour:any;
  retour_det=<any>[];
  hists=<any>[];
  Src='correctif';
  isData=true;

  
  constructor(private magRetourService:MagRetourService,private _currentRoute: ActivatedRoute
     ,public dialogRef: MatDialogRef<MagAffRetourComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
     ,private matDialog: MatDialog) { }
    
  
  ngOnInit() {
    var RetourID = +this._currentRoute.snapshot.paramMap.get('id');
    var Src = +this._currentRoute.snapshot.paramMap.get('src');

    if(!RetourID){
      RetourID=this.data.RetourID;
      Src=+this.data.Src;
    }

    if(Src==2){this.Src='preventif';}
    if(RetourID>0){ this.RetourID=RetourID; this.getRetourForAff(RetourID,this.Src); }
  }

  getRetourForAff(RetourID:number,Src:string){  
    this.magRetourService.getRetourForAff(RetourID,Src).then(
      res=>{
        console.log(res);
        
       
        this.retour=res.retour;
        this.retour_det=res.retour_det;
        this.hists=res.hists;
        this.RetourID=res.retour.RetourID;
        
      },
      err=>console.log(err)
    );
   }

   SrcToNumber(){
    if(this.Src=='correctif'){ return 1;}
    if(this.Src=='preventif'){ return 2;}
   }

   


   openRetourAdd(){
    this.dialogRef.close('openRetourAdd');
  }




   

}

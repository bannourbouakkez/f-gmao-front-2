import { Component, OnInit, Input, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MagBsoAccepterComponent } from 'src/app/features/magasin/bso/mag-bso-accepter/mag-bso-accepter.component';
import { MagBsoGererComponent } from 'src/app/features/magasin/bso/mag-bso-gerer/mag-bso-gerer.component';
import { BsooService } from '../../services/bsoo.service';
import { CorrBsoAddComponent } from '../corr-bso-add/corr-bso-add.component';


@Component({
  selector: 'app-corr-bso-aff',
  templateUrl: './corr-bso-aff.component.html',
  styleUrls: ['./corr-bso-aff.component.scss']
})
export class CorrBsoAffComponent implements OnInit {
  //---------- breadcrumb ---------
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/bsm',title:'Bso'} ,
    {url:'',title:'Affichage Bso'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  //###############################

  BsoID:number=0;
  bso:any;
  bso_dets=<any>[];
  response_bso:any;
  response_bso_dets=<any>[];
  combined=<any>[];
  
  loaded=false;


  constructor(private bsoService:BsooService,private _currentRoute: ActivatedRoute
    ,public dialogRef: MatDialogRef<CorrBsoAffComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
    ,private matDialog: MatDialog

    ) { }

  @Input() InputBsoID: number;
  @Input() InputSrc: string;
  Src='correctif';
  isData=true;
  source=false; // isFromOt
  
  ngOnInit() {

   
    let InputBsoID=this.InputBsoID;
    let InputSrc=this.InputSrc;
    if(InputBsoID>0){ 
      this.BsoID=InputBsoID; 
      this.Src=this.InputSrc;
      this.getBsoWithResponse(InputBsoID,this.Src); 

    }else{
      
      var BsoID = +this._currentRoute.snapshot.paramMap.get('id');
      var Src = this._currentRoute.snapshot.paramMap.get('Src');
      if(!BsoID){
       BsoID=this.data.BsoID;
       Src=this.data.Src;
       if(this.data.source=="ot"){
       this.source=true;
       }
      }

      if(Src=='preventif'){this.Src='preventif';}
      if(BsoID>0){ this.BsoID=BsoID; this.getBsoWithResponse(BsoID,this.Src); }
    
      
    }

  }

  getBsoWithResponse(BsoID:number,Src:string){  
    this.bsoService.getBsoWithResponse(BsoID,Src).then(
      res=>{
        console.log(res);
        
        //if(res.bso==null){this.bso=res.bsoWithNullOtID;} // zyéda 
        //else{this.bso=res.bso;} // zyéda 
        this.bso=res.bso; // originale 

        this.bso_dets=res.bso_dets;
        this.response_bso=res.response_bso;
        this.response_bso_dets=res.response_bso_dets;
        this.combined=res.combined;
        this.loaded=true;
        
      },
      err=>console.log(err)
    );
   }

   PouC(isCorrectif:string){
    if(isCorrectif=="correctif"){return "C";}
    if(isCorrectif=="preventif"){return "P";}
   }

   inIsCorrectifOut12(isCorrectif:string){
    if(isCorrectif=="correctif"){return 1;}
    if(isCorrectif=="preventif"){return 2;}
   }

  openAccepterBso(){
    this.dialogRef.close('openAccepterBso');
  }
  
  openGererBso(){
    this.dialogRef.close('openGererBso');
  }



}

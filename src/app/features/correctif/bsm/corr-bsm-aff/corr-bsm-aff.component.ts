import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BsmService } from '../../services/bsm.service';

@Component({
  selector: 'app-corr-bsm-aff',
  templateUrl: './corr-bsm-aff.component.html',
  styleUrls: ['./corr-bsm-aff.component.scss']
})
export class CorrBsmAffComponent implements OnInit {

  //---------- breadcrumb ---------
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/bsm',title:'Bsm'} ,
    {url:'',title:'Affichage Bsm'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  //###############################

  BsmID:number=0;
  bsm:any;
  bsm_dets=<any>[];
  response_bsm:any;
  response_bsm_dets=<any>[];
  combined=<any>[];
  
  loaded=false;

  Src='correctif';
  isCorrectif=true;
  isData=true;
  source=false; // isFromOt

  constructor(private bsmService:BsmService,private _currentRoute: ActivatedRoute
    ,public dialogRef: MatDialogRef<CorrBsmAffComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  @Input() InputBsmID: number;
  @Input() InputSrc: string;

  ngOnInit() {

    /*
    let BsmID = +this._currentRoute.snapshot.paramMap.get('id');
    let Src = +this._currentRoute.snapshot.paramMap.get('src');
    if(Src==2){this.Src='preventif';  this.isCorrectif=false;}
    if(BsmID>0){ this.BsmID=BsmID; this.getBsmWithResponse(BsmID,this.Src); }
    */

    let InputBsmID=this.InputBsmID;
    let InputSrc=this.InputSrc;
    //console.log(InputBsmID+' | ',InputSrc);
    if(InputBsmID>0){
      this.BsmID=InputBsmID; 
      this.Src=this.InputSrc;
      //this.isData=true;
      if(this.Src=='preventif'){this.isCorrectif=false;}
      this.getBsmWithResponse(InputBsmID,this.Src); 
    }else{
      var BsmID = +this._currentRoute.snapshot.paramMap.get('id');
      var Src = this._currentRoute.snapshot.paramMap.get('Src');
      
      if(!BsmID){
        BsmID=this.data.BsmID;
        Src=this.data.Src;
        if(this.data.source=="ot"){
        this.source=true;
        }
      }
      //this.isData=false;
      if(Src=='preventif'){this.Src='preventif';  this.isCorrectif=false;}
      if(BsmID>0){ this.BsmID=BsmID; this.getBsmWithResponse(BsmID,this.Src); }
    }


  }

  getBsmWithResponse(BsmID:number,Src:string){  
    //console.log(BsmID+','+Src);
    this.bsmService.getBsmWithResponse(BsmID,Src).then(
      res=>{
        console.log(res);
        
        this.bsm=res.bsm;
        this.bsm_dets=res.bsm_dets;
        this.response_bsm=res.response_bsm;
        this.response_bsm_dets=res.response_bsm_dets;
        this.combined=res.combined;
        

        this.loaded=true;
        
      },
      err=>console.log(err)
    );
   }

   isRetourCoP(isCorrectif:boolean){
    if(isCorrectif==true){return 1;}
    if(isCorrectif==false){return 2;}
   }

   PouC(isCorrectif:boolean){
    if(isCorrectif==true){return "C";}
    if(isCorrectif==false){return "P";}
   }

   openBsmAdd(){
    this.dialogRef.close('openBsmAdd');
  }
  


}

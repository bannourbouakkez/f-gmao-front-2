import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OtService } from '../../services/ot.service';
import { CorrBsoAddComponent } from '../../bso/corr-bso-add/corr-bso-add.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CorrBsmAddComponent } from '../../bsm/corr-bsm-add/corr-bsm-add.component';
import { AuthService } from 'src/app/shared/auth.service';
import { BsmService } from '../../services/bsm.service';
import { BsooService } from '../../services/bsoo.service';
import { MagBsmAffComponent } from 'src/app/features/magasin/bsm/mag-bsm-aff/mag-bsm-aff.component';
import { CorrBsmAffComponent } from '../../bsm/corr-bsm-aff/corr-bsm-aff.component';
import { CorrBsoAffComponent } from '../../bso/corr-bso-aff/corr-bso-aff.component';

@Component({
  selector: 'app-corr-ot-aff',
  templateUrl: './corr-ot-aff.component.html',
  styleUrls: ['./corr-ot-aff.component.scss']
})
export class CorrOtAffComponent implements OnInit {

     //---------- breadcrumb ---------
     autres=[ 
      //{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
      {url:'gmao/correctif/di/dis',title:'Liste DIs'}
      ,{url:'gmao/correctif/ot/ots',title:'Liste OTs'}
      //,{url:'gmao/preventif/plans/list',title:'Liste interventions planifiées'}
      ];
     breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/correctif',title:'correctif'} ,
      {url:'gmao/correctif/ot',title:'ot'},
      {url:'',title:'Affichage ordre de travail'}
    ];
    lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
    LoadingReactBtn1=false;
    //#################################
    niveaux=<any>[];

  OtID:number=0;
  BonID:number=0;
  ot:any;
  intervenants=<any>[];
  bsos=<any>[];
  bsms=<any>[];
  Src='correctif';
  cp='correctif';


  monid:number=0;
  constructor(private otService:OtService,private _currentRoute: ActivatedRoute,private dialog: MatDialog
             ,private _authService:AuthService , private bsmService:BsmService,private bsoService:BsooService
            ) { }
  
  ngOnInit() {
    this.monid=this.myid();
    let OtID = +this._currentRoute.snapshot.paramMap.get('id');
    if(OtID>0){  this.getOt(OtID); }

  }

  getOt(OtID:number){
    this.otService.getOt(OtID).then(
      res => {
         console.log(res);
         this.intervenants=res.intervenants2;
         this.ot=res.ot;
         this.bsos=res.bsos;
         this.bsms=res.bsms;
         this.OtID=res.ot.OtID;
         this.BonID=res.ot.BonID;
         this.niveaux=res.niveaux;
      },
      err => console.log(err)
     ); 
  }


  AddOrEditBso(OtID:number,BsoID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    let Src=this.Src;
    dialogConfig.data = { OtID,BsoID,Src};
    this.dialog.open(CorrBsoAddComponent, dialogConfig).afterClosed().subscribe(res => {
     // if(res=='again' && DaArticleIndex==null){this.AddOrEditDaArticle(DaArticleIndex, id); }
     if(res != undefined && res != null){
        if(res.BsoID>0){this.bsos.push(res);}
        if(res==true){ console.log('modification c bon ');}
      }
    });
  }

  AddOrEditBsm(OtID:number,BsmID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    let Src=this.Src;
    dialogConfig.data = { OtID,BsmID,Src }; 
    this.dialog.open(CorrBsmAddComponent, dialogConfig).afterClosed().subscribe(res => {
     if(res != undefined && res != null){
        if(res.BsmID>0){this.bsms.push(res);}
        if(res==true){console.log('modification c bon ');}
      }
    });
  }

  deleteBsm(BsmID:number){
    this.bsmService.deleteBsm(BsmID,this.cp).then(
      res => {
        if(res.success){
          for(let i=0;i<this.bsms.length;i++){
            if(this.bsms[i].BsmID==BsmID){
              this.bsms.splice(i,1);
            }
           }
        }
      },
      err=>{}
    );
   }

   deleteBso(BsoID:number){
    this.bsoService.deleteBso(BsoID,this.cp).then(
      res => {
        if(res.success){
          for(let i=0;i<this.bsos.length;i++){
            if(this.bsos[i].BsoID==BsoID){
              this.bsos.splice(i,1);
            }
           }
        }
      },
      err=>{}
    );
   }

   deleteOt(OtID:number){
    if(this.LoadingReactBtn1==false){
      this.LoadingReactBtn1=true;
    //console.log('da5lét sup');
    this.otService.deleteOt(OtID).then(
      res => {
         console.log(res);
         this.ngOnInit();
      });
    }
  }


  openBsm(BsmID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        let source="ot";
        dialogConfig.data={BsmID,Src,source};
        //this.dialog.open(MagBsmAffComponent, dialogConfig).afterClosed().subscribe( res=> {});
        this.dialog.open(CorrBsmAffComponent, dialogConfig).afterClosed().subscribe( res=> {});
  }

  openBso(BsoID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        let source="ot";
        dialogConfig.data={BsoID,Src,source};
        this.dialog.open(CorrBsoAffComponent, dialogConfig)
        .afterClosed().subscribe( res=> {});
  }


  //__________________

  isPoste(ExpectedPoste:string){
    return this._authService.isPoste(ExpectedPoste); 
  }
  isPosts(ExpectedPosts){
    let bool=false;
    for(let i=0;i<ExpectedPosts.length;i++){
      if(this.isPoste(ExpectedPosts[i])){ bool=true;}
    }
    return bool;
  }
  
  myid(){
    return this._authService.myid();
  }
  



}

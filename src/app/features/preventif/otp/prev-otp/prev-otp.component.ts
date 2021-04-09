import { Component, OnInit } from '@angular/core';
import { PrevOtpService } from '../../services/prev-otp.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from 'src/app/shared/auth.service';
import { CorrBsoAddComponent } from 'src/app/features/correctif/bso/corr-bso-add/corr-bso-add.component';
import { CorrBsmAddComponent } from 'src/app/features/correctif/bsm/corr-bsm-add/corr-bsm-add.component';
import { BsmService } from 'src/app/features/correctif/services/bsm.service';
import { BsooService } from 'src/app/features/correctif/services/bsoo.service';
import { CorrBsmAffComponent } from 'src/app/features/correctif/bsm/corr-bsm-aff/corr-bsm-aff.component';
import { CorrBsoAffComponent } from 'src/app/features/correctif/bso/corr-bso-aff/corr-bso-aff.component';

@Component({
  selector: 'app-prev-otp',
  templateUrl: './prev-otp.component.html',
  styleUrls: ['./prev-otp.component.scss']
})
export class PrevOtpComponent implements OnInit {

   //---------- breadcrumb ---------
   autres=[ 
    //{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    {url:'gmao/preventif/otp/otps',title:'Liste ordres de travail'}
    //,{url:'gmao/preventif/plans/list',title:'Liste interventions planifiées'}
    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/otp',title:'ot'},
    {url:'',title:'Affichage ordre de travail'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  //#################################


  cp='preventif';
  OtpID:number=0;
  BonpID:number=0;
  otp:any;
  intervenants=<any>[];
  bsos=<any>[];
  bsms=<any>[];
  Src='preventif';

  articles_reserved=<any>[];
  reservation:any;


IntReservationID:number=0;
DateTimeOTp:string='date/date/date';
local_2_reservedintervenants=<any>[];
getOtp_Load=false;;

niveaux=<any>[]

  monid:number=0;

  intervention:any;
  constructor(private otService:PrevOtpService,private _currentRoute: ActivatedRoute,private dialog: MatDialog
             ,private _authService:AuthService,    private bsmService:BsmService , private bsoService:BsooService
             ) { }
  
  ngOnInit() {
    this.monid=this.myid();
    let OtpID = +this._currentRoute.snapshot.paramMap.get('id');
    if(OtpID>0){  this.getOtp(0,OtpID); }
  }

  getOtp(InterventionID:number,OtpID:number){
    this.otService.getOtp(0,OtpID).then(
      res => {
         console.log(res);
         //this.intervenants=res.intervenants2;
         this.otp=res.otp;
         this.bsos=res.bsos;
         this.bsms=res.bsms;
         console.log(this.bsms);
         this.OtpID=res.otp.OtpID;
         this.BonpID=res.otp.BonpID;
         this.articles_reserved=res.articles_reserved.BsmArticles;
         this.reservation=res.reservation;
         this.niveaux=res.niveaux;
         
         this.DateTimeOTp=res.otp.date_execution;
         this.IntReservationID=res.IntReservationID;
         this.local_2_reservedintervenants=res.reservedintervenants;

         this.getOtp_Load=true;

         this.intervention=res.intervention;
      },
      err => console.log(err)
     ); 
  }
  
  deleteOtp(OtpID:number){
    if(this.LoadingReactBtn1==false){
      this.LoadingReactBtn1=true;
    //console.log('da5lét sup');
    this.otService.deleteOtp(OtpID).then(
      res => {
         console.log(res);
         this.ngOnInit();
      });
    }
  }

  AddOrEditBso(OtID:number,BsoID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    let Src=this.Src;
    dialogConfig.data = { OtID,BsoID,Src }; 
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
        console.log(res);
        
        if(res.BsmID>0){this.bsms.push(res);}
        if(res==true){console.log('modification c bon ');}
        
      }
    });
  }


  
  AddOrEditBsmForReservation(OtID:number,BsmID:number) {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    let Src=this.Src;
    let Reservation='reservation'; 
    let articles_reserved=this.articles_reserved;
    dialogConfig.data = { OtID,BsmID,Src,Reservation,articles_reserved }; 
    this.dialog.open(CorrBsmAddComponent, dialogConfig).afterClosed().subscribe(res => {
     if(res != undefined && res != null){
        // console.log(res);
        
        //if(res.BsmID>0){this.bsms.push(res);}
        //if(res==true){console.log('modification c bon ');}
        
       this.articles_reserved=res.articles_reserved;
       if(res.reservation){ this.reservation=res.reservation;}
      

      }
    });
    
    
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


  
  ViderArticlesReserved(ReservationID:number){
    this.otService.ViderArticlesReserved(ReservationID).then(
      res => {
        if(res.success){
         this.articles_reserved=[];
         this.reservation=null;
        }
      },
      err=>{}
    );
  }
  


  
  getIntReservationID(e){
    this.IntReservationID=e;
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


  
  affichageUnite(unite:string){
    if(unite=='unitaire'){
     return "";
    }else{
      return unite;
    }
   }

   
  



}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrevOtpService } from '../../services/prev-otp.service';
import { CorrBsmAddComponent } from 'src/app/features/correctif/bsm/corr-bsm-add/corr-bsm-add.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PrevResIntService } from '../otp-reservation-intervenants/prev-res-int.service';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-prev-add-otp',
  templateUrl: './prev-add-otp.component.html',
  styleUrls: ['./prev-add-otp.component.scss']
})
export class PrevAddOtpComponent implements OnInit {

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
    {url:'',title:'Executer OT'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  //###############################

  InterventionID:number=0;
  OtpID:number=0;
  intervention:any;
  otp:any;
  niveaux=<any>[];
  form:FormGroup;
  loading=false;
  allLoaded=false;
  
  reservation:any;
  articles_reserved=<any>[];


  IntReservationID:number=0;
  DateTimeOTp:string='date/date/date';
  local_2_reservedintervenants=<any>[];
  
  
  constructor(private fb: FormBuilder , private otpService:PrevOtpService,private _currentRoute: ActivatedRoute
             ,private dialog: MatDialog,private resIntService:PrevResIntService,private _notification: MessageService,private _router: Router) { }
  
  ngOnInit() {
    this.InitForm();
    let InterventionID = +this._currentRoute.snapshot.paramMap.get('InterventionID');
    let OtpID = +this._currentRoute.snapshot.paramMap.get('OtpID');
    this.form.patchValue({intervention_id:InterventionID});
    this.getOtp(InterventionID,OtpID);
  }

  InitForm(){
    this.form = this.fb.group({
      intervention_id:[''],
      date_execution:['',Validators.required]
  });
  }

  
  onSubmit(){

    //console.log(this.form.value);
    
    if(this.form.valid && !this.LoadingReactBtn1){
    if(this.OtpID==0){
    this.LoadingReactBtn1=true;
    //console.log(this.resIntService.reservedintervenants);
    //let reservedintervenants=this.resIntService.reservedintervenants;
    this.otpService.addOtp(this.InterventionID,this.form.value,this.articles_reserved,this.resIntService.reservedintervenants).then(
      res=>{
        //console.log(res);
        //this.LoadingReactBtn1=false;
        if(res.OtpID){
        this.notification('success', "L'OT est exécutée avec succès.", 3000);
        this.redirection(this.UrlToRedirection+res.OtpID);
        }else{
          this.notification('danger', "Error.", 1000);
        }

      }
    );
    

    }else{
      /*
      this.otpService.editOtp(this.OtpID,this.form.value,articles_reserved).then(
        res=>{
          console.log(res);
        }
      );
      */
    }
  }else{
    this.notification('danger', "Date d'execution est obligatoire.", 1000);
  }


  }


  getOtp(InterventionID:number,OtpID:number){
    this.loading=true;
    this.otpService.getOtp(InterventionID,OtpID).then(
      res=>{ 
          
         console.log(res);
         this.loading=false;
         this.InterventionID=InterventionID;
         if(res.otp){
           this.OtpID=res.otp.OtpID; this.otp=res.otp;
           this.form.patchValue(res.otp);
          }
         this.intervention=res.intervention;
         this.niveaux=res.niveaux;
         console.log(this.intervention);
         this.allLoaded=true;

        },
      err=>console.log(err)
    );
  }

  
  AddOrEditBsm(OtID:number,BsmID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    let Src='rien';
    let NotSend='NotSend';
    let Reservation='reservation'; // 21 07 tawa s
    let articles_reserved=this.articles_reserved;
    dialogConfig.data = { OtID,BsmID,Src,NotSend,articles_reserved,Reservation }; 
    this.dialog.open(CorrBsmAddComponent, dialogConfig).afterClosed().subscribe(res => {
     if(res != undefined && res != null){
        /*
        if(res.BsmID>0){this.reservation=res;}
        if(res==true){console.log('modification c bon ');}
        */
       this.articles_reserved=[];
       if(res.length>0){
        for(let i=0;i<res.length;i++){
        this.articles_reserved.push(res[i]);
        }
       }
       


      }
    });
  }
  


  ViderArticlesReserved(){
    this.articles_reserved=[];
  }

  
  ViderIntervenantsReserved(){
    //this.articles_reserved=[];
  }


  affichageUnite(unite:string){
   if(unite=='unitaire'){
    return "";
   }else{
     return unite;
   }
  }


  
  // ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/preventif/otp/otp/";
  redirection(url) {
    this._router.navigate([url]);
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
  //###################################################


  



  




}

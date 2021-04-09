import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipementService } from 'src/app/features/equipement/services/equipement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'angular-tree-component';
import { InterventionService } from '../../services/intervention.service';
import * as errors from './errors';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EquiTacheAddComponent } from 'src/app/features/equipement/tache/equi-tache-add/equi-tache-add.component';

@Component({
  selector: 'app-prev-add-intervention',
  templateUrl: './prev-add-intervention.component.html',
  styleUrls: ['./prev-add-intervention.component.scss']
})
export class PrevAddInterventionComponent implements OnInit {
  elem:any;
  // ---- form errors --------------------------
  formErrors = errors.formErrors;
  validationMessages = errors.validationMessages;
  private sub_errors: any;
  //############################################


  InterventionID: number = 0;
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/preventif/intervention/interventions',title:'Liste interventions'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
  breadcrumb = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/preventif', title: 'preventif' },
    { url: 'gmao/preventif/intervention', title: 'intervention' },
    { url: 'gmao/preventif/intervention/addoredit', title: this.AjouterOuModifier(this.InterventionID)+' intervention' }
  ];
  LoadingReactBtn1=false;
  //###############################
  PageInterventionLoaded = false;
  intervention:any;
  isModifiable=false;

  
  form: FormGroup;
  //date=new Date();
  //users=<any>[];
  //demandeurs=<any>[];
  //recepteurs=<any>[];
  //me:any;

  taches = <any>[];
  niveaux = <any>[];
  node: TreeNode;
  EquipementID: number = 0;
  InpuEquipementID: number;
  InpuName: string;

  arrWithZero = this.returnArrWithZero(9);

  /*
  selectedOption;
  options = [
  { value: 'jack', label: 'Jacks' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'disabled', label: 'Disabled', disabled: true }
  ];

  formtest: FormGroup;
*/

  constructor(private fb: FormBuilder, private equipementService: EquipementService, private interventionService: InterventionService
    , private _currentRoute: ActivatedRoute,
    private _router: Router
    , private _notification: MessageService
    //,private matDialog: MatDialog,private globalService:GlobalService,private _uploadService:UploadService,private diService:DiService
    //private _authService:AuthService,
    ,@Inject(DOCUMENT) private document: any
    ,private matDialog: MatDialog

  ) { }

  

  ngOnInit() {


    this.elem = document.documentElement;

    //this.formtest = this.fb.group({oppa: ['lucy']});

    this.InitForm();
    let InterventionID = +this._currentRoute.snapshot.paramMap.get('id');
    if (InterventionID > 0) {
      this.InterventionID = InterventionID;
      this.getIntervention(InterventionID);
    }
  }

  InitForm() {
    this.form = this.fb.group({
      //InterventionID: [''],
      user_id: [''],
      decalage: ['0'],
      date_resultat: [''],
      equipement_id: [''],
      tache_id: ['', Validators.required],
      ddr: ['', Validators.required],
      ancien_ddr: [''],
      type: ['', Validators.required],
      observation: ['',],
      nb_operateur: ['1', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      frequence: ['1', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      parametrage: ['', Validators.required],
      h: ['0', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      m: ['0', Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
    });

    this.sub_errors = this.form.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.form);
    });

  }

 

  ReceptNode(node: TreeNode) {
    this.EquipementID = node.data.id;
    this.node = node;
    this.getTachesByEquipementID(node.data.id, 0);
  }

  getTachesByEquipementID(EquipementID: number, TacheID) {
    this.equipementService.getTachesByEquipementID(EquipementID).then(
      res => {

        this.taches = res;
        this.form.patchValue({ equipement_id: EquipementID });
        if (TacheID > 0) {
          this.form.patchValue({ tache_id: TacheID });
        } else {
          this.form.patchValue({ tache_id: '' });
        }

      },
      err => console.log()
    );
  }
  openDialogAddTache(){
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data=this.node;
    this.matDialog.open(EquiTacheAddComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if( res != undefined && res!=null ) {
      this.getTachesByEquipementID(this.EquipementID,res.TacheID);
      }
      });
  }
/*
getTachesByEquipementID(EquipementID:number,TacheID){
   this.equipementService.getTachesByEquipementID(EquipementID).then(
     res=>{
       this.taches=res;
       this.form.patchValue({equipement_id:EquipementID});
       if(TacheID>0){
        this.form.patchValue({tache_id:TacheID});
       }else{
        this.form.patchValue({tache_id:''});
       }
      },
     err=>console.log()
   );
  }
*/


  getIntervention(InterventionID: number) {
    this.interventionService.getIntervention(InterventionID).then(
      res => {

        this.form.patchValue(res.intervention);
        this.EquipementID = res.intervention.equipement_id;
        
        this.niveaux = res.niveaux;
        this.EquipementID = res.equipement.EquipementID;
        this.InpuEquipementID = res.equipement.EquipementID;
        this.InpuName = res.equipement.equipement;
        let obj2: any = {};
        obj2.id = res.equipement.EquipementID;
        obj2.name = res.equipement.equipement;
        obj2.depth = res.equipement.Niv;
        let obj3: any = {};
        obj3.data = obj2;
        this.node = obj3;


        this.getTachesByEquipementID(res.equipement.EquipementID, res.intervention.tache_id);
        this.intervention=res.intervention;
        this.PageInterventionLoaded = true;
        this.isModifiable=res.isModifiable;

      });
  }

  changeMinute() {
    var minute = this.form.controls['m'].value;
    if (minute > 59) { this.form.patchValue({ m: 0 }); }
    if (minute < 0) { this.form.patchValue({ m: 59 }); }
    //if(minute>=0 && minute<=9){this.form.patchValue({m:this.arrWithZero[minute]});}
  }

  changeHeure() {
    let heure = this.form.controls['h'].value;
    //if(heure>23){this.form.patchValue({h:0});}
    //if(heure<0){this.form.patchValue({h:23});}
    //if(heure>=0 && heure<=9){ this.form.patchValue({h:this.arrWithZero[heure]});}
  }

  returnArrWithZero(num: number) {
    let arr = new Array(); for (let i = 0; i <= num; i++) { let withZero = '0' + i; arr.push(withZero); } return arr;
  }

  onSubmit() {


    if (this.form.get('m').value == 60) {
      let nvh = +this.form.get('h').value + 1;
      this.form.patchValue({ h: nvh });
      this.form.patchValue({ m: 0 });
    }

    //console.log(this.form.value);

    if (this.form.valid) {
     if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;
      console.log(this.form.value);

      if (this.InterventionID == 0) {
       
        this.interventionService.addIntervention(this.form.value).then(
          res => {
            console.log(res);
            
  
  this.LoadingReactBtn1=false;
  
  if(res.success){
    //this.InitForm(); this.niveaux=[]; this.InpuEquipementID=null;this.InpuName=null;
    let reset_equipement_id=this.form.controls.equipement_id.value;
    this.form.reset();
    this.form.patchValue({equipement_id:reset_equipement_id,decalage:0,frequence:1,});
    
    
    this.notification('success',res.msg, 3000);
    //this.redirection(this.UrlToRedirection+res.InterventionID);
  }else{
    this.notification('danger',res.msg, 3000);
  }
 

          
          }
        );
      } else {
        
        this.interventionService.editIntervention(this.form.value, this.InterventionID).then(
          res => {
            console.log(res);
            this.LoadingReactBtn1=false;
            if(res.intervention){
              this.notification('success', "L'intervention est Modifiée avec succès.", 3000);
              this.redirection(this.UrlToRedirection+this.InterventionID);
              }else{
              this.notification('danger',res.msg, 5000);
              }


          }
        );
      }
    }
    } else {

     this.form.markAllAsTouched();
     this.logValidationErrors(this.form);

     this.notification('danger', 'Formulaire est non valide', 1000);

    }




  }

// ------ Notification & Redirection  --------------
UrlToRedirection="/gmao/preventif/intervention/intervention/";
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


  // -------------- Form Errors -----------------------------
  ngOnDestroy() { this.sub_errors.unsubscribe(); }

  logValidationErrors(group: FormGroup = this.form): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              //console.log( 'this.formErrors : '+this.formErrors +' , key : '+key+ ' , this.formErrors[key] : '+this.formErrors[key]);
              //console.log('messages : '+messages+' , messages[errorKey] : '+messages[errorKey])
              this.formErrors[key] += messages[errorKey] + ' <br> ';
            }
          }
        }
      }
    })
  }
  // ############################################################

  AjouterOuModifier(bool){
    if(bool){return 'Modifier';}
    else{ return 'Ajouter';}
  }



























/*
  constructor(@Inject(DOCUMENT) private document: any) {}
  elem;

  ngOnInit() {
    this.elem = document.documentElement;
  }
*/
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }





}


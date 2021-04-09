import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { MagBsoService } from '../../services/mag-bso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'angular-tree-component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { BsooService } from 'src/app/features/correctif/services/bsoo.service';
import { CorrBsoOutilsComponent } from 'src/app/features/correctif/bso/corr-bso-outils/corr-bso-outils.component';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-mag-bso-add',
  templateUrl: './mag-bso-add.component.html',
  styleUrls: ['./mag-bso-add.component.scss']
})
export class MagBsoAddComponent implements OnInit {

   //---------- breadcrumb ---------
   autres=[
         {url:'gmao/magasin/bso/bsos/1',title:'Liste Utilisation'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
  breadcrumb = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/magasin', title: 'magasin' },
    { url: 'gmao/magasin/utilisation', title: 'utilisation' },
    //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
    { url: '#', title: 'Ajouter Utilisation' }
  ];

  breadcrumb2 = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/magasin', title: 'magasin' },
    { url: 'gmao/magasin/utilisation', title: 'utilisation' },
    //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
    { url: '#', title: 'Modifier Utilisation' }
  ];

  LoadingReactBtn1=false;
  AjouterOuModifier(bool){
    if(bool){return 'Modifier';}
    else{ return 'Ajouter';}
  }
  PageLoaded=false;
  //###############################

  date=new Date();
  load=false;

  UseID:number=0;
  UseForm:FormGroup;
  intervenants=<any>[];
  
  node:TreeNode;
  EquipementID:number=0;
  InpuEquipementID:number;
  InpuName:string;

  
  isValid: boolean;
  form: NgForm;
  OtID:number=0;
  loading=false;

  constructor( 
    private dialog: MatDialog, 
    //@Inject(MAT_DIALOG_DATA) public data , 
    //public dialogRef: MatDialogRef<MagBsoAddComponent>,
    private bsooService:BsooService,

    private fb:FormBuilder, private bsoService:MagBsoService,private _currentRoute: ActivatedRoute,private router:Router
    ,private _notification: MessageService) { }

  ngOnInit() {
    this.UseFormOnInit();
    this.resetForm(); // 

    let UseID = +this._currentRoute.snapshot.paramMap.get('id');
    if(UseID>0){
      this.UseID=UseID;
      this.getUse(UseID);
      }else{
        this.getUse(0);
        this.date=this.ReglageDate(this.date);
        this.UseForm.patchValue({time:this.date});
        this.UseForm.patchValue({date:this.date});
      }
  }

  
 
  UseFormOnInit(){
    this.UseForm=this.fb.group({
      UseID:[''],
      user_id:[''],
      intervenant_id:['',Validators.required],
      equipement_id:['',Validators.required],
      bso_id:[''],
      date: ['',Validators.required],
      time: ['',Validators.required],
      datetime: [''],
      date_cloture:[''],
      isOpened:[1],
      NbDeModif:[0],
      exist:[1],
      created_at:[''],
      updated_at:['']
    });
  }


  getUse(UseID:number){
   
    
    this.bsoService.getUse(UseID).then(
      res=>{
       if(UseID>0 && res.use.isOpened==0){
         this.router.navigate(['/']);
        }
       this.load=true;
        if(UseID>0){
        this.intervenants=res.intervenants;
        this.EquipementID=res.use.equipement_id;
        this.InpuEquipementID=this.EquipementID;
        this.InpuName=res.equipement.data.name;

        //setTimeout(()=>{ this.UseForm.setValue(res.use);},1000)
       // console.log(res.);
       

        this.UseForm.setValue(res.use);
        this.UseForm.patchValue({time:res.use.datetime});
        this.UseForm.patchValue({date:res.use.date});
        
        let obj2:any={};
        obj2.id=this.EquipementID;
        obj2.name=res.equipement.data.name;
        obj2.depth=res.equipement.data.depth;
        let obj3:any={};
        obj3.data=obj2;
        this.node=obj3;
        }else{
          this.intervenants=res.intervenants;
        }

        this.getBso(this.UseForm.get('bso_id').value);
        this.PageLoaded=true;

      },
      err=>console.log(err)
    );

    //this.UseForm.setValue(res.use);
  }
  
  
  ReceptNode(node:TreeNode){
    this.EquipementID=node.data.id;
    this.node=node;
    this.UseForm.patchValue({equipement_id:this.EquipementID});
  }

  
  console(){
    console.log(this.UseForm.value);
  }
  
  

  
  submit(){

    
    if (this.UseForm.valid && this.bsooService.bsoarticles.length>0) {
       if(!this.LoadingReactBtn1){
       this.LoadingReactBtn1=true;

    this.bsooService.formData.UseForm=this.UseForm.value;
    if(this.UseID==0){
    this.bsooService.addUse().then(
      res=>{
        this.LoadingReactBtn1=false;
        this.notification('success', "Utilisation est ajouté avec succées.", 1500);
        this.redirection(this.UrlToRedirection+res.UseID);
        console.log(res);
      },
      err=>console.log(err)
    );
    }

   if(this.UseID>0){
    this.bsooService.editUse(this.UseID).then(
     res=>{
       this.LoadingReactBtn1=false;
      console.log(res);
      this.notification('success', "Utilisation est Modifiée avec succées.", 1500);
      this.redirection(this.UrlToRedirection+this.UseID);


},
     err=>console.log(err)
   );
   }
   
 
    }
    }else{
      this.notification('danger', "Formulaire est non valide .", 2000);
    }
  }







resetForm() {
  this.bsooService.formData = {
    DeletedBsoDetIDs: ''
  };
  this.bsooService.bsoarticles = [];
}
AddOrEditDaArticle(BsoArticleIndex, BsoID) {
  let Use='Use';
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  //dialogConfig.disableClose = true;
  dialogConfig.width = "50%"; 
  dialogConfig.data = { BsoArticleIndex , BsoID , Use}; 
  this.dialog.open(CorrBsoOutilsComponent, dialogConfig).afterClosed().subscribe(res => {
    
   if(res=='again' && BsoArticleIndex==null){ this.AddOrEditDaArticle(BsoArticleIndex, BsoID); }

  });
}

onDeleteBsoArticle(BsoDetID: number, i: number) {
  //console.log(bsoDetID);
  //console.log(this.bsoService.formData.DeletedbsoDetIDs);
  if (BsoDetID != null){ 
    this.bsooService.formData.DeletedBsoDetIDs += BsoDetID + ",";
  }
  this.bsooService.bsoarticles.splice(i, 1);
}

validateForm() {
  this.isValid = true;
  if (this.bsooService.bsoarticles.length == 0){this.isValid = false;}
  return this.isValid;
}

/*
Submit() {
 // this.dialogRef.close(this.bsoService.bsoarticles);
 if (this.validateForm()) {
  // let id = this.currentRoute.snapshot.paramMap.get('id');
  console.log(this.bsooService.bsoarticles);
   if (this.data.BsoID == null ){
   this.bsooService.addBso(this.OtID,this.bsooService.formData,this.bsooService.bsoarticles).then(
     res => {
    // if(res.success){ this.dialogRef.close(res.bso);
    // }else{ this.dialogRef.close(false);}
     })
   }else{
   this.bsooService.editBso(this.data.BsoID).then(res => {
     //this.dialogRef.close(res);
   })
 }
}
}
*/

getBso(BsoID){
if (BsoID == null || BsoID == 0) {
  //this.resetForm();
}else{
   this.loading=true;
   this.bsooService.getBsoByID(BsoID,'zayda_el_parametre_aslan_ma_nest7a9héch_fil_backend').then(res => {
   this.loading=false;
   //this.bsoService.formData = res; // na77itha jdid 
   this.bsooService.bsoarticles = res.BsoArticles;
  });
} 
}

ReglageDate(date:Date){
  let userTimezoneOffset = date.getTimezoneOffset() * 60000;
  let date2=new Date(this.date.getTime() - userTimezoneOffset);
  return date2;
}

// ------ Notification & Redirection  --------------
UrlToRedirection="/gmao/magasin/outil/use/";
redirection(url){
  this.router.navigate([url]);
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

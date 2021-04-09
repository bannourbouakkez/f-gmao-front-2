import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CorrBsoOutilsComponent } from '../corr-bso-outils/corr-bso-outils.component';
import { BsooService } from '../../services/bsoo.service';
//import { CorrBsoArticlesComponent } from '../corr-bso-articles/corr-bso-articles.component';

@Component({
  selector: 'app-corr-bso-add',
  templateUrl: './corr-bso-add.component.html',
  styleUrls: ['./corr-bso-add.component.scss']
})
export class CorrBsoAddComponent implements OnInit {



  //constructor(){}
  //ngOnInit() {}


  
  isValid: boolean;
  form: NgForm;
  OtID:number=0;
  loading=false;

  Src='';

  constructor(
    //private bsoService:BsoService,
    private bsoService:BsooService,
    private _fb: FormBuilder,
    private currentRoute: ActivatedRoute, 
    private _router:Router,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data , 
    public dialogRef: MatDialogRef<CorrBsoAddComponent>
    ) { }


  ngOnInit() {
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    this.resetForm();
    this.Src=this.data.Src ;
    let OtID = this.data.OtID ;
    this.OtID=OtID;
    let BsoID = this.data.BsoID;
    if (BsoID == null) {this.resetForm();}
    else {
       this.loading=true;
       this.bsoService.getBsoByID(parseInt(BsoID),this.Src).then(res => {
       this.loading=false;
       //this.bsoService.formData = res; // na77itha jdid 
       this.bsoService.bsoarticles = res.BsoArticles;
       

      
      // if(( this.bsoService.formData.statut!='rejete' && this.bsoService.formData.statut!='rejeteParAdmin')){
       //  this._router.navigate(['/']);
      // }
      


      });
    } 
  }


  resetForm() {
    this.bsoService.formData = {
      DeletedBsoDetIDs: ''
    };
    this.bsoService.bsoarticles = [];
  }

  validateForm() {
    this.isValid = true;
    if (this.bsoService.bsoarticles.length == 0){this.isValid = false;}
    return this.isValid;
  }
  
  
  AddOrEditDaArticle(BsoArticleIndex, BsoID) {
 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "40%"; 
    dialogConfig.data = { BsoArticleIndex , BsoID }; 
    this.dialog.open(CorrBsoOutilsComponent, dialogConfig).afterClosed().subscribe(res => {
      
     //if(res=='again' && BsoArticleIndex==null){ this.AddOrEditDaArticle(BsoArticleIndex, BsoID); }

    });
  }


  onDeleteBsoArticle(BsoDetID: number, i: number) {
    //console.log(bsoDetID);
    //console.log(this.bsoService.formData.DeletedbsoDetIDs);
    if (BsoDetID != null){ 
      this.bsoService.formData.DeletedBsoDetIDs += BsoDetID + ",";
    }
    this.bsoService.bsoarticles.splice(i, 1);
  }


  Submit() {
 
     //console.log(this.bsoService.bsoarticles);

     // this.dialogRef.close(this.bsoService.bsoarticles);


    if (this.validateForm()) {

     // let id = this.currentRoute.snapshot.paramMap.get('id');
     console.log(this.bsoService.bsoarticles);
      if (this.data.BsoID == null ){
      this.bsoService.addBso(this.OtID,this.bsoService.formData,this.bsoService.bsoarticles,this.Src).then(
        res => {
        //console.log(res);

        if(res.success){
          this.dialogRef.close(res.bso);
        }else{
          this.dialogRef.close(false);
        }
        
          //this.resetForm(); 
          //this._router.navigate(['/achat/da/gererda/das']); // this.toastr 
        })
      }else{
      this.bsoService.editBso(this.data.BsoID).then(res => {
        this.dialogRef.close(res);
        //console.log(res);
        //this._router.navigate(['/achat/da/gererda/das']); // this.toastr  
      })
      
    }
  
  }

  

}


  public OnlyNumbers($event) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
    //enter code here
    if (specialKeys.indexOf($event.key) !== -1) { return; }
    else { if (regex.test($event.key)) { return true; } else { return false; } }
  }







}
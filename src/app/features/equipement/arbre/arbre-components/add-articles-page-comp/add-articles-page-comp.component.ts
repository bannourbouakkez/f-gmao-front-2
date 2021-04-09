import { Component, OnInit, Inject, Input , EventEmitter, Output} from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddArticlesService } from '../add-articles.service';
import { AddArticlesCompComponent } from '../add-articles-comp/add-articles-comp.component';

@Component({
  selector: 'app-add-articles-page-comp',
  templateUrl: './add-articles-page-comp.component.html',
  styleUrls: ['./add-articles-page-comp.component.scss']
})
export class AddArticlesPageCompComponent implements OnInit {
  
  isValid: boolean;
  loading=false;
  form: NgForm;
  @Input() EquipementID:number;

  @Output() emitter = new EventEmitter<any>();

  
  constructor(private _fb: FormBuilder, private addArticle:AddArticlesService,
    private dialog: MatDialog,private _router:Router,
    //@Inject(MAT_DIALOG_DATA) public data
    ) { }



  //ngOnInit() {
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    //this.resetForm();
    
    //let OtID = this.data.OtID ;
    //this.OtID=OtID;
    //let BsmID = this.data.BsmID;

    //if (BsmID == null) {this.resetForm();}
    //else {
      /*
       this.loading=true;
       this.addArticle.getBsmByID(parseInt(BsmID)).then(res => {
       this.loading=false;
       //this.bsmService.formData = res; // na77itha jdid 
       this.bsmService.bsmarticles = res.BsmArticles;
       */

      /*
       if(( this.bsmService.formData.statut!='rejete' && this.bsmService.formData.statut!='rejeteParAdmin')){
         this._router.navigate(['/']);
       }
      */


      //});
    //} 
  //}

  ngOnInit() {
    this.isValid = true; // 1111111111111111111111111111111111111111111111111111111111
    this.resetForm();
    this.loading=true;
      this.addArticle.getArticlesMagasinAtelierByEquipementID(this.EquipementID).then(res => {
      this.loading=false;
      this.addArticle.articlesMagasin = res.articlesMagasin;
      this.addArticle.articlesAtelier = res.articlesAtelier;
      });
  }


  resetForm() {
    this.addArticle.formData = {
      DeletedMagasinDetIDs: '',
      DeletedAtelierDetIDs: ''
    };
    this.addArticle.articlesMagasin = [];
    this.addArticle.articlesAtelier = [];
  }

  /*
  validateForm() {
    this.isValid = true;
    if (this.bsmService.bsmarticles.length == 0){this.isValid = false;}
    return this.isValid;
  }
  */
  
  
  AddOrEditEquipementArticle(ArticleIndex,EquipementID,type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%"; 
    dialogConfig.data = { ArticleIndex , EquipementID , type }; 
    this.dialog.open(AddArticlesCompComponent,dialogConfig).afterClosed().subscribe(res => {
     this.updateData();
     //if(res=='again' && ArticleIndex==null){ this.AddOrEditEquipementArticle(ArticleIndex,EquipementID,type); }
    });
  }

  updateData(){
    let data:any={};
    data.EquipementID=this.EquipementID;
    data.formData=this.addArticle.formData;
    data.articlesMagasin=this.addArticle.articlesMagasin;
    data.articlesAtelier=this.addArticle.articlesAtelier;
    this.emitter.emit(data);
  }

/*
  Submit() {
   
   //if (this.validateForm()) {
     if (true) {
    // if (this.EquipementID == null ){
     this.addArticle.AddOrEditEquipementArticle(this.EquipementID,this.addArticle.formData,this.addArticle.articlesMagasin,this.addArticle.articlesAtelier).then(
       res => {
         console.log(res);
       if(res.success){
        // this.dialogRef.close(res.bsm);
       }else{
        // this.dialogRef.close(false);
       }
       })
     //}else{
      // this.bsmService.editBsm(this.data.BsmID).then(res => {
      // this.dialogRef.close(res);
     //})
     //}
     
 }
}
*/




  onDeleteArticlesMagasin(MagasinDetID: number, i: number) {
    if (MagasinDetID != null){ 
      this.addArticle.formData.DeletedMagasinDetIDs += MagasinDetID + ",";
    }
    this.addArticle.articlesMagasin.splice(i, 1);
    this.updateData();
  }
  
  onDeleteArticlesAtelier(AtelierDetID: number, i: number) {
    if (AtelierDetID != null){ 
      this.addArticle.formData.DeletedAtelierDetIDs += AtelierDetID + ",";
    }
    this.addArticle.articlesAtelier.splice(i, 1);
    this.updateData();
  }


/*
  Submit() {
 
     //console.log(this.bsmService.bsmarticles);

     // this.dialogRef.close(this.bsmService.bsmarticles);


    if (this.validateForm()) {

     // let id = this.currentRoute.snapshot.paramMap.get('id');
      if (this.data.BsmID == null ){
      this.bsmService.addBsm(this.OtID,this.bsmService.formData,this.bsmService.bsmarticles).then(
        res => {
        //console.log(res);
        if(res.success){
          this.dialogRef.close(res.bsm);
        }else{
          this.dialogRef.close(false);
        }
        
          //this.resetForm(); 
          //this._router.navigate(['/achat/da/gererda/das']); // this.toastr 
        })
      }else{
      this.bsmService.editBsm(this.data.BsmID).then(res => {
        this.dialogRef.close(res);
        //console.log(res);
        //this._router.navigate(['/achat/da/gererda/das']); // this.toastr  
      })
      
    }
  
  }

  

}
*/

  public OnlyNumbers($event) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
    //enter code here
    if (specialKeys.indexOf($event.key) !== -1) { return; }
    else { if (regex.test($event.key)) { return true; } else { return false; } }
  }









}

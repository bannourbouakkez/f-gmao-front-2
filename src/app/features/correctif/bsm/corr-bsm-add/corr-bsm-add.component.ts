import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsmService } from '../../services/bsm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CorrBsmArticlesComponent } from '../corr-bsm-articles/corr-bsm-articles.component';

@Component({
  selector: 'app-corr-bsm-add',
  templateUrl: './corr-bsm-add.component.html',
  styleUrls: ['./corr-bsm-add.component.scss']
})
export class CorrBsmAddComponent implements OnInit {
  isValid: boolean;
  form: NgForm;
  OtID:number=0;
  loading=false;
  Src='';
  
  constructor(private _fb: FormBuilder, private bsmService:BsmService,
    private currentRoute: ActivatedRoute, 
    
    private dialog: MatDialog,private _router:Router,

    @Inject(MAT_DIALOG_DATA) public data , public dialogRef: MatDialogRef<CorrBsmAddComponent>

    ) { }



  ngOnInit() {
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    console.log('BsmID:'+this.data.BsmID+',Reservation:'+this.data.Reservation
    +'NotSend:'+this.data.NotSend);
    //console.log('articles_reserved');
    //console.log(this.data.articles_reserved);
   

    this.resetForm();
    this.Src=this.data.Src ;
    let OtID = this.data.OtID ;
    this.OtID=OtID;
    let BsmID = this.data.BsmID;
    if (BsmID == null || BsmID==undefined) { // BsmID==undefined zedha le 11/07/2020 
      
      this.resetForm();
     
      if(this.data.Reservation=='reservation'){
        

        console.log(this.data.articles_reserved);
        //console.log('111');


      /*
      let array_articles_reserved=<any>[];
      array_articles_reserved=this.data.articles_reserved;
      if(array_articles_reserved.length>0){
        this.bsmService.bsmarticles = this.data.articles_reserved;
      }
      */



     
     //console.log();
     //console.log(this.data.articles_reserved[0]);
     
      this.bsmService.bsmarticles=[];
      if(this.data.articles_reserved.length>0){
       for(let i=0;i<this.data.articles_reserved.length;i++){
        this.bsmService.bsmarticles.push(this.data.articles_reserved[i]);
       }
      }
    
      








      }

    }else {
       this.loading=true;
       if(this.data.Reservation!='reservation'){
       this.bsmService.getBsmByID(parseInt(BsmID),this.Src).then(res => {
       console.log(res);
       this.loading=false;
       //this.bsmService.formData = res; // na77itha jdid 
       this.bsmService.bsmarticles = res.BsmArticles;
       

      /*
       if(( this.bsmService.formData.statut!='rejete' && this.bsmService.formData.statut!='rejeteParAdmin')){
         this._router.navigate(['/']);
       }
      */


      });

      }else{
      this.bsmService.getReservationBsmByID(parseInt(BsmID)).then(res => {
        console.log(res);
        this.loading=false;
        this.bsmService.bsmarticles = res.BsmArticles;
       });
      }

    } 
  }


  resetForm() {
    this.bsmService.formData = {
      DeletedBsmDetIDs: ''
    };
    this.bsmService.bsmarticles = [];
  }

  validateForm() {
    this.isValid = true;
    if (this.bsmService.bsmarticles.length == 0){this.isValid = false;}
    return this.isValid;
  }
  
  
  AddOrEditDaArticle(BsmArticleIndex, BsmID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "50%"; 
    let Reservation='tjhjkge';
    if(this.data.Reservation=='reservation'){
      Reservation='reservation';
    }
    dialogConfig.data = { BsmArticleIndex,BsmID,Reservation }; 
    this.dialog.open(CorrBsmArticlesComponent, dialogConfig).afterClosed().subscribe(res => {
      
     //if(res=='again' && BsmArticleIndex==null){ this.AddOrEditDaArticle(BsmArticleIndex, BsmID); }

    });
  }


  onDeleteBsmArticle(BsmDetID: number, i: number) {
    //console.log(BsmDetID);
    //console.log(this.bsmService.formData.DeletedBsmDetIDs);
    if (BsmDetID != null){ 
      this.bsmService.formData.DeletedBsmDetIDs += BsmDetID + ",";
    }
    this.bsmService.bsmarticles.splice(i, 1);
  }


  Submit() {
 
     //console.log(this.bsmService.bsmarticles);

     // this.dialogRef.close(this.bsmService.bsmarticles);


    if (this.validateForm()) {

     // let id = this.currentRoute.snapshot.paramMap.get('id');
      if (this.data.BsmID == null || this.data.BsmID==undefined){ // zedtha le 11/07/2020 
       
      if(this.data.Reservation!='reservation'){


      ///////////////////if(this.data.NotSend!='NotSend'){
      this.bsmService.addBsm(this.OtID,this.bsmService.formData,this.bsmService.bsmarticles,this.Src).then(
        res => {
        //console.log(res);
        if(res.success){
          this.dialogRef.close(res.bsm);
        }else{
          this.dialogRef.close(false);
        }
        
          //this.resetForm(); 
          //this._router.navigate(['/achat/da/gererda/das']); // this.toastr 
        });
      ////////////////////}else{this.dialogRef.close(this.bsmService.bsmarticles);}


      }else{


      if(this.data.NotSend!='NotSend'){
         this.bsmService.addReservationBsm(this.OtID).then(
        res => {
        if(res.success){
          this.dialogRef.close(res);
        }else{
          this.dialogRef.close(false);
        }
        })


      }else{this.dialogRef.close(this.bsmService.bsmarticles);}


      }
      
    }else{


      if(this.data.Reservation!='reservation'){

      this.bsmService.editBsm(this.data.BsmID,this.Src).then(res => {
        this.dialogRef.close(res);
        //console.log(res);
        //this._router.navigate(['/achat/da/gererda/das']); // this.toastr  
      })

     }else{

      this.bsmService.editReservationBsm(this.data.BsmID).then(res => {
        this.dialogRef.close(res);
        //console.log(res);
        //this._router.navigate(['/achat/da/gererda/das']); // this.toastr  
      })

     }



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

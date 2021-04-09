import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { DaService } from '../services/da.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaArticleComponent } from '../da-article/da-article.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'src/app/@pages/components/message/message.service';
// ma famma chay 
@Component({
  selector: 'app-add-da',
  templateUrl: './add-da.component.html',
  styleUrls: ['./add-da.component.scss']
})
export class AddDaComponent implements OnInit {

  DaID:number=0;
  //---------- breadcrumb ---------
  autres=[
    {url:'gmao/achat/da/gererda/das',title:'Liste DAs'}
//,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
];

breadcrumb = [
{ url: 'gmao', title: 'home' },
{ url: 'gmao/achat', title: 'achat' },
{ url: 'gmao/achat/DA', title: 'DA' },
//{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
{ url: '#', title: "Ajouter Demande d'achat" }
];

breadcrumb2 = [
{ url: 'gmao', title: 'home' },
{ url: 'gmao/achat', title: 'achat' },
{ url: 'gmao/achat/DA', title: 'DA' },
//{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
{ url: '#', title: "Modifier Demande d'achat" }
];

LoadingReactBtn1=false;
AjouterOuModifier(bool){
if(bool){return 'Modifier';}
else{ return 'Ajouter';}
}
PageLoaded=false;
loading=false;
//###############################

  //element: HTMLElement;
  periode: string;
  isValid: boolean;
  isValidDelai=true;
  form: NgForm;
  constructor(private _fb: FormBuilder, private _daService: DaService,
    private currentRoute: ActivatedRoute, private dialog: MatDialog,
    private _router:Router
    ,private _notification: MessageService
    ) { }



  ngOnInit() {
    let id = +this.currentRoute.snapshot.paramMap.get('id');
    
    if (!(id>0)) {this.resetForm();}
    else {
      this.DaID=id;
      this.loading=true;
       //                       parseInt
       this._daService.getDaByID(id).then(res => {
       console.log(res);
       if(res==false){
          this._router.navigate(['/']);
       }
       this._daService.formData = res;
       this._daService.daarticles = res.DaArticles;
       let arrDelaiPeriode=this.affecterDelaiPeriode(this._daService.formData.delai);
       this._daService.formData.delai=arrDelaiPeriode[0];
       this._daService.formData.periode=arrDelaiPeriode[1];
       this.DaID=id;
       //this.PageLoaded=true;
       this.loading=false;

       if(( this._daService.formData.statut!='rejete' && this._daService.formData.statut!='rejeteParAdmin')){
         this._router.navigate(['/']);
       }

       this.PageLoaded=true;

      });
      
    } 
  }


  
    calculerDelai(periode):number{
      var unite=1;
      if(periode=="jour"){unite=1;}  if(periode=="semaine"){unite=7;} if(periode=="mois"){unite=30;}if(periode=="annee"){unite=365;}
      return  Number( Number(this._daService.formData.delai) * unite);
    }
  

  
  resetForm(form?: NgForm) {
    this._daService.formData = {
      ref: Math.floor(10000000 + Math.random() * 90000000).toString(),
      delai: 0,
      periode: 'jour',
      remarques: '',
      DeletedDaArticleIDs: ''
    };
    this._daService.daarticles = [];
  }
  
  validateForm() {
    this.isValid = true;
    if (this._daService.daarticles.length == 0)
      this.isValid = false;
    if (this._daService.formData.delai == 0 || isNaN(Number(this._daService.formData.delai)) )
      {this.isValid = false; this.isValidDelai=false; }

    return this.isValid;
  }
  
  
  AddOrEditDaArticle(DaArticleIndex, id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { DaArticleIndex, id };
    this.dialog.open(DaArticleComponent, dialogConfig).afterClosed().subscribe(res => {
     //if(res=='again' && DaArticleIndex==null){this.AddOrEditDaArticle(DaArticleIndex, id); }
    });
  }


  onDeleteDaArticle(DaArticleID: number, i: number) {
    if (DaArticleID != null)
    this._daService.formData.DeletedDaArticleIDs += DaArticleID + ",";
    this._daService.daarticles.splice(i, 1);
  }


  onSubmit(form: NgForm) {

    if (this.validateForm() ) {
      if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;

      this._daService.formData.delai=this.calculerDelai(this._daService.formData.periode);
      var id = +this.currentRoute.snapshot.paramMap.get('id');
      if (!(id>0)){
      this._daService.saveDa()
       .subscribe(res => {
        //this.resetForm(); 
        //this._router.navigate(['/gmao/achat/da/gererda/das']); // this.toastr 
        this.LoadingReactBtn1=false;
        this.notification('success',res.msg, 1500);
        this.redirection(this.UrlToRedirection+res.DaID);

        })
      }else{
      this._daService.updateDa()
      .subscribe(res => {
        //this._router.navigate(['/gmao/achat/da/gererda/das']); // this.toastr  
        //console.log(res);
  
      this.LoadingReactBtn1=false;
      this.notification('success',res.msg, 1500);
      this.redirection(this.UrlToRedirection+id);

      })
    }
  }

  
}else{
  console.log(this.validateForm());
  console.log(this._daService.daarticles);
  this.notification('danger', "Formulaire est non valide .", 2000);
}

  }


  public OnlyNumbers($event) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
    //enter code here
    if (specialKeys.indexOf($event.key) !== -1) { return; }
    else { if (regex.test($event.key)) { return true; } else { return false; } }
  }





affecterDelaiPeriode(delai){
let delper=new Array;
let del; let per;
if(delai%365==0){del=delai/365;per='annee';}
else if(delai%30==0){del=delai/30;per='mois';}
else if(delai%7==0){del=delai/7;per='semaine';}
else{del=delai;per='jour';}
delper[0]=del;
delper[1]=per;
return delper;
}



// ------ Notification & Redirection  --------------
UrlToRedirection="/gmao/achat/da/da/";
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

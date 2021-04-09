import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MagRetourService } from '../../services/mag-retour.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MagRetourAddComponent } from '../mag-retour-add/mag-retour-add.component';
import { MagAffRetourComponent } from '../mag-aff-retour/mag-aff-retour.component';

@Component({
  selector: 'app-mag-list-retour',
  templateUrl: './mag-list-retour.component.html',
  styleUrls: ['./mag-list-retour.component.scss']
})
export class MagListRetourComponent implements OnInit {

    //---------- breadcrumb ---------
    autres=[ 
      //{url:'gmao/magasin/bso/bsos',title:'Liste Bso'}
      ];
     breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/magasin',title:'magasin'} ,
      {url:'gmao/magasin/retour',title:'retour'},
      {url:'',title:'Liste retours'}
    ];
    lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
    //###############################

  // Pagination && Filter Form -------
  // Pagination 
  p: number = 1; total: number; itemsPerPage = 10; loadingFilter: boolean;
  selectedItemPerPage="10";
  // Filter Form 
  rechercheAuto = new FormControl(true);
  firstDay = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 2);
  filterForm: FormGroup = new FormGroup({
    searchFilterText: new FormControl(),
    datemin: new FormControl(this.firstDay),
    datemax: new FormControl(),
    statut: new FormControl(['enAttente'])
  });
  //###################################
  retours: any[] = [];

  constructor(private magRetourService:MagRetourService,private matDialog: MatDialog) { }

  ngOnInit() {
    this.getRetours(1);
    this.FilterValuesChanges();
  }


  getRetours(page: number) {
    this.loadingFilter = true;
    this.magRetourService.getRetours(page, this.itemsPerPage, this.filterForm.value).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.retours = res.retours;
        console.log(res.retours);
      }
    );
  }

  inIsCorrectifOut12(isCorrectif:number){
    if(isCorrectif==1){return 1;}
    if(isCorrectif==0){return 2;}
   }

   CorP(isCorrectif:number){
    if(isCorrectif==1){return 'C';}
    if(isCorrectif==0){return 'P';}
  }

  openRetourAdd(RetourID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={RetourID,Src};
        this.matDialog.open(MagRetourAddComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
           if(res=='envoyer'){
           this.RetourAdded(RetourID,Src);
           }
        });
  }

  RetourAdded(RetourID,Src){
    //console.log('res='+BsoID);   
    let isCorrectif=3;
    if(Src==1){isCorrectif=1;} 
    if(Src==2){isCorrectif=0;} 
    for(let i=0;i<this.retours.length;i++){
      if(this.retours[i].RetourID==RetourID && this.retours[i].isCorrectif==isCorrectif){
        this.retours[i].statut='ferme';
      }
    }
  }

  openRetouraff(RetourID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={RetourID,Src};
        this.matDialog.open(MagAffRetourComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='openRetourAdd'){
            this.openRetourAdd(RetourID,Src);
          }
        });
  }

  

  
 // New Filter && Pagination ---------------------------------
 filter() {
  this.getRetours(1);
}
auto() {
  if (this.rechercheAuto.value == true) {
    this.filter();
  }
}
resetFilter() {
  this.filterForm.patchValue({
    searchFilterText: '',
    datemin: this.firstDay,
    datemax: '',
    statut: ['enAttente']
  });
  if (this.rechercheAuto.value == false) {this.filter();}
}
FilterValuesChanges() {
  this.filterForm.valueChanges
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(value => this.auto())
}
incrementsItemsPerPage(e) {
  //this.itemsPerPage = e.target.value;
  this.itemsPerPage = e;
  this.filter();
}
// New Filter && Pagination #####################################



}


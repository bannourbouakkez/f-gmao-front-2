import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TreeNode } from 'angular-tree-component';
import { MagBsmService } from '../../services/mag-bsm.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MagBsmAffComponent } from '../mag-bsm-aff/mag-bsm-aff.component';
import { MagBsmAccepterComponent } from '../mag-bsm-accepter/mag-bsm-accepter.component';
import { isMoment } from 'moment';


@Component({
  selector: 'app-mag-bsm-list',
  templateUrl: './mag-bsm-list.component.html',
  styleUrls: ['./mag-bsm-list.component.scss']
})
export class MagBsmListComponent implements OnInit {

     //---------- breadcrumb ---------
     autres=[ 
      {url:'gmao/magasin/bso/bsos/0',title:'Liste Bso'}
      ];
     breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/magasin',title:'magasin'} ,
      {url:'gmao/magasin/bsm',title:'bsm'},
      {url:'',title:'Liste Bsm'}
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
  nodes=<any>[]; // SBN
  bsms: any[] = [];
  me: any;
  
  
  
  constructor(private magBsmService: MagBsmService, private _authService: AuthService
             ,private fb: FormBuilder,private matDialog: MatDialog) { }

  ngOnInit() {
    this.getBsms(1);
    this.FilterValuesChanges();
  }
  
  /*
   ReglageDate(date:Date){
     let userTimezoneOffset = date.getTimezoneOffset() * 60000;
     let nvdate=new Date(date.getTime() - userTimezoneOffset);
     return nvdate;
   }
   */

  getBsms(page: number) {
    this.loadingFilter = true;
    this.magBsmService.getBsms(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {   
        console.log(res.bsms);
                                                                       // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;

        this.me = res.me;
        this.bsms = res.bsms;

        console.log(res.bsms);
      }
    );
  }
  
  inIsCorrectifOut12(isCorrectif:number){
   if(isCorrectif==1){return 1;}
   if(isCorrectif==0){return 2;}
  }
  
  isCorrectifOuPreventif(isCorrectif:number){
    if(isCorrectif==1){return 'correctif';}
    if(isCorrectif==0){return 'preventif';}
   }

  CorP(isCorrectif:number){
    if(isCorrectif==1){return 'C';}
    if(isCorrectif==0){return 'P';}
  }

  isPoste(ExpectedPoste: string) {
    return this._authService.isPoste(ExpectedPoste);
  }

  isPosts(ExpectedPosts) {
    let bool = false;
    for (let i = 0; i < ExpectedPosts.length; i++) {
      if (this.isPoste(ExpectedPosts[i])) { bool = true; }
    }
    return bool;
  }
  isCCR(di: any) {
    if ((this.me.id == di.user_id) || (this.me.id == di.demandeur_user_id) || (this.me.id == di.recepteur_user_id)) {
      return true;
    } else {
      return false;
    }
  }


  ReceptNodes(e){ this.nodes=e; this.filter(); } // SBN
  NodesArrToIdsArr(ArrNodes){ // SBN 
    let arr=new Array();
    let Node:TreeNode;
    for (let i = 0; i < ArrNodes.length; i++) {
      Node=ArrNodes[i];
      let ID=Node.data.id;
      arr.push(ID);
     }
    return arr; 
  }


  openBsm(BsmID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BsmID,Src};
        this.matDialog.open(MagBsmAffComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='openBsmAdd'){
            let Src2=0;
            if(Src=='correctif'){Src2=1;}
            if(Src=='preventif'){Src2=2;}
            if(Src2==1 || Src2==2){
              this.openAccepterBsm(BsmID,Src2)
            }
          }
        });
  }

  openAccepterBsm(BsmID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BsmID,Src};
        this.matDialog.open(MagBsmAccepterComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          this.BsmAccepted(BsmID,Src,res);
        });
  }

  BsmAccepted(BsmID,Src,acceptedorrefused){
  if(acceptedorrefused){
  let isCorrectif=3;
 
    if(Src==1){isCorrectif=1;} 
    if(Src==2){isCorrectif=0;} 
    console.log('isCorrectif:'+isCorrectif);
    for(let i=0;i<this.bsms.length;i++){
      if(this.bsms[i].BsmID==BsmID && this.bsms[i].isCorrectif==isCorrectif){
        this.bsms[i].statut=acceptedorrefused;
        let now=new Date();
        console.log(now);
        console.log(this.tarki7date(now));
        this.bsms[i].updated_at=this.tarki7date(now);
      }
    }
    console.log(this.bsms);
  }
}

tarki7date(date){
  //if(date==null) return date;
  if (isMoment(date)){
     return date.format('YYYY-MM-DD HH:mm');
  }
  return date;
}

  
  // New Filter && Pagination ---------------------------------
  filter() {
    this.getBsms(1);
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
    this.nodes=[];
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






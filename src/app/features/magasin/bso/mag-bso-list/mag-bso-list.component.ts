import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TreeNode } from 'angular-tree-component';
import { MagBsoService } from '../../services/mag-bso.service';
import { MagBsoAffComponent } from '../mag-bso-aff/mag-bso-aff.component';
import { MagUseAffComponent } from '../../outil/mag-use-aff/mag-use-aff.component';
import { MagBsoAccepterComponent } from '../mag-bso-accepter/mag-bso-accepter.component';
import { MagBsoGererComponent } from '../mag-bso-gerer/mag-bso-gerer.component';
import { isMoment } from 'moment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-mag-bso-list',
  templateUrl: './mag-bso-list.component.html',
  styleUrls: ['./mag-bso-list.component.scss']
})
export class MagBsoListComponent implements OnInit {

       //---------- breadcrumb ---------
       autres=[ 
        {url:'gmao/magasin/bsm/bsms',title:'Liste Bsm'}
        ];
       breadcrumb=[
        {url:'gmao',title:'home'},
        {url:'gmao/magasin',title:'magasin'} ,
        {url:'gmao/magasin/bso',title:'bso'},
        {url:'',title:'Liste Bso'}
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
    type: new FormControl(['bso', 'use']),
    statut: new FormControl(['ouvert', 'repondu'])
  });
  //###################################
  nodes=<any>[]; // SBN

  bsos: any[] = [];
  me: any;

  

  constructor(private magBsoService: MagBsoService, private _authService: AuthService
             ,private fb: FormBuilder,private matDialog: MatDialog
             ,private _currentRoute: ActivatedRoute) { }

  ngOnInit() {
    var utilisation = +this._currentRoute.snapshot.paramMap.get('utilisation');
    if(utilisation){
      this.filterForm.patchValue({
        type: ['use']
      });
    }

    this.getBsos(1);
    this.FilterValuesChanges();
  }

  /*
   ReglageDate(date:Date){
     let userTimezoneOffset = date.getTimezoneOffset() * 60000;
     let nvdate=new Date(date.getTime() - userTimezoneOffset);
     return nvdate;
   }
   */

  getBsos(page: number) {
    this.loadingFilter = true;
    this.magBsoService.getBsos(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {   
        console.log(res);                                                               // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;

        this.me = res.me;
        this.bsos = res.bsos;

        console.log(res.bsos);
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


   PouCouU(isCorrectif:boolean,OtID){
    //console.log(OtID);
    //if(OtID>0){
    if(isCorrectif==true){return "C";}
    if(isCorrectif==false){return "P";}
    //}
    //return "U";
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
  
  openBso(BsoID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BsoID,Src};
        this.matDialog.open(MagBsoAffComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          
          //console.log('res openBso:'+res+' , BsoID:'+BsoID+' , Src:'+Src);
         
         if(res=='openAccepterBso'){
           let Src2=0;
           if(Src=='correctif'){Src2=1;}
           if(Src=='preventif'){Src2=2;}
           if(Src2==1 || Src2==2){
             this.openAccepterBso(BsoID,Src2);
           }
          }

          if(res=='openGererBso'){
            let Src2=0;
            if(Src=='correctif'){Src2=1;}
            if(Src=='preventif'){Src2=2;}
            if(Src2==1 || Src2==2){
              this.openGererBso(BsoID,Src2);
            }
           }
        
        });
  }

  openUse(UseID,BsoID){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass="custom-dialog-container";
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data={UseID};
    this.matDialog.open(MagUseAffComponent, dialogConfig)
    .afterClosed().subscribe( res=> {

      if(res=='openGererBso'){
       this.openGererBso(BsoID,'null');
      }
      

    });
  }

  openAccepterBso(BsoID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BsoID,Src};
        this.matDialog.open(MagBsoAccepterComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
           this.BsoAccepted(res);
        });
  }

  openGererBso(BsoID,Src){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BsoID,Src};
        this.matDialog.open(MagBsoGererComponent, dialogConfig)
        .afterClosed().subscribe( res=> {

          this.BsoGered(res,BsoID);

        });
  }

  BsoAccepted(BsoID){
    console.log('res='+BsoID);    
    for(let i=0;i<this.bsos.length;i++){
      if(this.bsos[i].BsoID==BsoID){
        this.bsos[i].statut='repondu';
      }
    }
  }

  BsoGered(res,BsoID){
    if(res=='ttesttermine'){
     // this.bsos = this.bsos.filter(d => d.BsoID !== BsoID);
      for(let i=0;i<this.bsos.length;i++){
        if(this.bsos[i].BsoID==BsoID){
          this.bsos[i].statut='ferme';
          let now=new Date();

          this.bsos[i].date_cloture=this.tarki7date(now);
        }
      }

    }
    console.log(this.bsos);
    //console.log('bso gered nthabbit esque wallét férmé walla w chnowa nbaddil w date de cloture .... ');    
  }



  tarki7date(date){
    //if(date==null) return date;
    if (isMoment(date)){
       return date.format('YYYY-MM-DD HH:mm');
    }
    return date;//.slice(0,10);
  }



  // New Filter && Pagination ---------------------------------
  filter() {
    this.getBsos(1);
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
      type: ['bso', 'use'],
      statut: ['ouvert','repondu']

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






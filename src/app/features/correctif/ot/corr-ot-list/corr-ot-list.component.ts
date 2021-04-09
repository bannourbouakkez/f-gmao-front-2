import { Component, OnInit } from '@angular/core';
import { DiService } from '../../services/di.service';
import { AuthService } from 'src/app/shared/auth.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/features/magasin/services/article.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TreeNode } from 'angular-tree-component';
import { OtService } from '../../services/ot.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-corr-ot-list',
  templateUrl: './corr-ot-list.component.html',
  styleUrls: ['./corr-ot-list.component.scss']
})
export class CorrOtListComponent implements OnInit {

   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/correctif/bon/bons',title:'Liste Bons'},
    {url:'gmao/correctif/di/dis',title:'Liste DIs'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/correctif',title:'correctif'} ,
    {url:'gmao/correctif/ot',title:'ot'},
    {url:'',title:'Liste Ots'}
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
    type: new FormControl(['mecanique', 'electrique', 'autres']),
    degre: new FormControl(['faible', 'moyen', 'urgent']),
    statut: new FormControl(['enAttente', 'enCours'])
  });
  //###################################
  nodes=<any>[]; // SBN

  dis: any[] = [];
  me: any;

  

  constructor(private otService: OtService, private _authService: AuthService,
              private fb: FormBuilder,private matDialog: MatDialog,private _router:Router,private _notification: MessageService) { }
  ngOnInit() {

    if( !this.isPosts(['Admin','Methode','ChefDePoste','ResponsableMaintenance']) ){
      this._router.navigate(['/index']);
    }
    
    this.getOts(1);
    this.FilterValuesChanges();
  }

  getOts(page: number) {
    this.loadingFilter = true;
    this.otService.getOts(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.dis = res.dis;
        console.log(res.dis);
      }
    );
  }

  deleteOt(OtID:number){
    
    this.otService.deleteOt(OtID).then(
      res => {
         console.log(res);
         if(res.success){
          this.dis = this.dis.filter(d => d.OtID !== OtID);
          this.notification('success', "L'ordre de travail # "+OtID+" est supprimé.", 2000);
        }

      });
    
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
  
  // New Filter && Pagination ---------------------------------
  filter() {
    this.getOts(1);
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
      type: ['mecanique', 'electrique', 'autres'],
      degre: ['faible', 'moyen', 'urgent'],
      statut:['enAttente', 'enCours']
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

  
  // ------ Notification & Redirection  --------------

  
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

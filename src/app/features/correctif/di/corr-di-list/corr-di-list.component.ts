import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DiService } from '../../services/di.service';
import { AuthService } from 'src/app/shared/auth.service';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/features/magasin/services/article.service';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CorrDiPlanComponent } from '../corr-di-plan/corr-di-plan.component';
import { TreeNode } from 'angular-tree-component';
import { MessageService } from 'src/app/@pages/components/message/message.service';

//import {replace_} from '../../../../../environments/replace';


@Component({
  selector: 'app-corr-di-list',
  templateUrl: './corr-di-list.component.html',
  styleUrls: ['./corr-di-list.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush

})
export class CorrDiListComponent implements OnInit {

   //---------- breadcrumb ---------
   //_replace(module:string,type:string,word:string|number){ return replace_(module,type,word);}
   autres=[ 
    {url:'gmao/correctif/di/add/0',title:'Ajouter DI'},
    {url:'gmao/correctif/ot/ots',title:'Liste OTs'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/correctif',title:'correctif'} ,
    {url:'gmao/correctif/di',title:'DI'},
    {url:'',title:'Liste DIs'}
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
    //statut: new FormControl(['enCours', 'ferme','enAttente'])
    statut: new FormControl(['enAttente'])
  });
  //###################################
  nodes=<any>[]; // SBN

  dis: any[] = [];
  me: any;

  

  constructor(private diService: DiService, private _authService: AuthService, private articleService: ArticleService
    , private fb: FormBuilder,private matDialog: MatDialog,private _notification: MessageService) { }

  ngOnInit() {
    this.getDis(1);
    this.FilterValuesChanges();
  }
  
  /*
   ReglageDate(date:Date){
     let userTimezoneOffset = date.getTimezoneOffset() * 60000;
     let nvdate=new Date(date.getTime() - userTimezoneOffset);
     return nvdate;
   }
   */

  getDis(page: number) {
    this.loadingFilter = true;
    this.diService.getDis(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;

        this.me = res.me;
        this.dis = res.dis;
      }
    );
  }
 
  deleteDi(DiID:number){
      this.diService.deleteDi(DiID).then(
        res=>{
          console.log(res);
          if(res.success){
            this.dis = this.dis.filter(d => d.DiID !== DiID);
            this.notification('success', "La demande d'intervention # "+DiID+" est supprimé.", 2000);
          }else{
            this.notification('danger', "Error .", 2000);
          }
          
        },
        err=>console.log(err)
      );

  }

  
  planifierDi(PlanID:number,DiID:number){
    
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = "500px";
      dialogConfig.data={PlanID,DiID};
      this.matDialog.open(CorrDiPlanComponent, dialogConfig)
      .afterClosed().subscribe( res=> {
        if( res != undefined && res!=null  ){
          //console.log(res);
          //console.log('res of planifierDi of CorrDiListComponent:'+res);
          this.ChangerStatutAddIDAfterAction(res.PlanID,DiID,'planifie');
        }
      });
  
  }
  
  deplanifierDi(PlanID:number){
    this.diService.deplanifierDi(PlanID).then(
      res=>{ 
         console.log(res); 
         if(res.success){
           this.notification('success',res.msg, 3000);
         }else{
          this.notification('danger',res.msg, 3000);
         }
         //this.ChangerStatutAddIDAfterAction(null,);
         },
      err=>console.log(err)
    );
  }
  
  ChangerStatutAddIDAfterAction(PlanID:number,DiID:number,statut:string){
    for(let i=0;i<this.dis.length;i++){
      if(this.dis[i].DiID==DiID){
        this.dis[i].statut=statut;
        this.dis[i].PlanID=PlanID;
        //console.log(this.dis[i]);
      }
    }
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

  // New Filter && Pagination ---------------------------------
  filter() {
    this.getDis(1);
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





/*
  dis: Observable<any[]>;
  me:any;
  p: number = 1; total: number; itemsPerPage=2; loading: boolean;



    getDis(page: number) {
     this.loading = true;
     this.dis = this.diService.getDis(page,this.itemsPerPage)
     .pipe(
        tap(res => {
            console.log(res);
            this.total = res.total;
            this.p = page;
            this.loading = false;
            this.me=res.me;
        }),
        map(res => res.dis)
    );
    this.dis.subscribe();
  }




  getDis(page:number,itemsPerPage:number):Observable<any>{
    var body={page:page,itemsPerPage:itemsPerPage};
    return this.http.post<any>(environment.apiUrl+'/correctif/di/getDis',body).toPromise();
  }



  <ng-container *ngFor="let di of dis | async | paginate:....

*/

/*
function replace (module:string,type:string,word:string){
  if(module=='correctif' && type=='type_di'){
     switch (word) {
         case 'electrique':return 'Eléctrique';break;
         case 'mecanique':return 'Mécanique';break;
         default:return word;break;
     }
  }
 
 }
 */
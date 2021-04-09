import { Component, OnInit } from '@angular/core';
import { DiService } from '../../services/di.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CorrDiPlanComponent } from '../../di/corr-di-plan/corr-di-plan.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TreeNode } from 'angular-tree-component';
import { FormGroup, FormControl } from '@angular/forms';
import { isMoment } from 'moment';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-corr-plan-list',
  templateUrl: './corr-plan-list.component.html',
  styleUrls: ['./corr-plan-list.component.scss']
})
export class CorrPlanListComponent implements OnInit {
  
     //---------- breadcrumb ---------
     autres=[ 
      {url:'gmao/correctif/di/dis',title:'Liste DIs'},
      {url:'gmao/correctif/plan/calender',title:'calendrier'}
      ];
     breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/correctif',title:'correctif'} ,
      {url:'gmao/correctif/di',title:'DI'},
      {url:'',title:'Liste DIs planifiées'}
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
      //statut: new FormControl(['enAttente'])
    });
    //###################################
    nodes=<any>[]; // SBN
  
    //dis: any[] = [];
    me: any;


  plans=<any>[];
  constructor(private diService:DiService,private matDialog: MatDialog,private _router:Router,private _authService:AuthService
    ,private _notification: MessageService) { }
  
  ngOnInit() {

    if( !this.isPosts(['Admin','Methode']) ){
      this._router.navigate(['/index']);
    }

    this.getPlans(1);
    this.FilterValuesChanges();

    
  }
  
  getPlans(page: number){
    /*
    this.diService.getPlans().then(
      res=>{
        console.log(res);this.plans=res;
        this.addAttOtID();
      },
      err=>console.log(err)
    );
    */

   this.loadingFilter = true;
   this.diService.getPlansForList(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
     res => {                                                             // SBN 
       this.total = res.total; this.p = page; this.loadingFilter = false;

       this.me = res.me;
       this.plans = res.plans;
     }
   );

  }
  
  addAttOtID(){
    for (let i = 0; i < this.plans.length; i++) {
      this.plans[i].otid=null;
     }
  }

  planifierDi(PlanID:number,i:number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data={PlanID};
    this.matDialog.open(CorrDiPlanComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if( res != undefined && res!=null  ){

        //this.plans[i]=res;
        this.ReplaceDate(res.datetime,res.type,PlanID);
      }
    });
  }
  
  deplanifierDi(PlanID:number,i:number){
    this.diService.deplanifierDi(PlanID).then(
      res=>{ 
        if(res.success==true){
          //this.plans.splice(i, 1);
          this.plans[i].isExecuted=1;
          this.notification('success',res.msg, 3000);
        }else{
          this.notification('danger',res.msg, 3000);
        }
       },
      err=>console.log(err)
    );
  }
  
  executerPlan(PlanID:number,i:number){
   this.diService.executerPlan(PlanID).then(
     res=>{
      console.log(res);
      if(res.success){
         // console.log(res.ot);
         this.plans[i].isExecuted=1;
         this.plans[i].otid=res.ot.OtID;
         this.notification('success',res.msg, 3000);
        }else{
          this.notification('danger',res.msg, 3000);
        }
      

     },
     err=>console.log(err)
   );
  }

  ReplaceDate(date,type:string,PlanID:number){
    for (let i = 0; i < this.plans.length; i++) {
      if(this.plans[i].PlanID==PlanID){
        //console.log(this.plans[i]);
        this.plans[i].datetime=date; //this.JustDateString(date); //date; //this.JustDateString(date);
        this.plans[i].type=type;
        //this.plans[i].date_resultat=this.JustDateString(date);
        
      }
    }
    console.log(this.plans);
  }

   
JustDateString(date:string){

  if(date==null) return date;
  if (isMoment(date)){
     return date.format('YYYY-MM-DD');
  }
  return date.slice(0,10);
}




  //_________________________

  isPoste(ExpectedPoste:string){
    return this._authService.isPoste(ExpectedPoste); 
   }
   isPosts(ExpectedPosts){
    let bool=false;
    for(let i=0;i<ExpectedPosts.length;i++){
      if(this.isPoste(ExpectedPosts[i])){ bool=true;}
    }
    return bool;
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
    this.getPlans(1);
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
      //statut: ['enAttente']
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
  
}
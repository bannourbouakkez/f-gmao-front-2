import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InterventionService } from '../../services/intervention.service';
import { TreeNode } from 'angular-tree-component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GlobalService } from 'src/app/shared/global.service';
import { SharedReporterDateComponent } from 'src/app/shared/others/shared-reporter-date/shared-reporter-date.component';
import { isMoment } from 'moment';

@Component({
  selector: 'app-prev-plan-list',
  templateUrl: './prev-plan-list.component.html',
  styleUrls: ['./prev-plan-list.component.scss']
})
export class PrevPlanListComponent implements OnInit {

  
   //---------- breadcrumb ---------
   autres=[ 
    //{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    {url:'gmao/preventif/intervention/interventions',title:'Liste interventions'},
    {url:'gmao/preventif/plans/ipcalender',title:"calendrier"}

    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/intervention',title:'intervention'},
    {url:'',title:'Liste planification'}
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
    type: new FormControl(['mecanique', 'electrique', 'graissage','hydrolique','pneumatique'])
  });

  //###################################
  nodes=<any>[]; // SBN
  plans=<any>[];

  loading_reporter_InterventionID=0;

  constructor(private fb: FormBuilder,private interventionService:InterventionService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getPlans(1);
    this.FilterValuesChanges();
  }

  getPlans(page: number) {
    this.loadingFilter = true;
    this.interventionService.getPlans(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;

        //this.me = res.me;
        this.plans = res.plans;
        console.log(this.plans);

      }
    );
  }



  reporterPlandialog(date:string,InterventionID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "25%";
    let msg="Reporter";
    dialogConfig.data = { date,msg }; 
    this.dialog.open(SharedReporterDateComponent, dialogConfig).afterClosed().subscribe(res => {
     if(res != undefined && res != null){

       
       this.reporterPlan(res,InterventionID);
       

      }
    });
  }


  
  reporterPlan(date,InterventionID:number){
    this.loading_reporter_InterventionID=InterventionID;
    //console.log(date+','+InterventionID);
      
      this.interventionService.reporterPlan(date,InterventionID).then(
        res=>{
          this.loading_reporter_InterventionID=0;

          if(res.success){

            this.ReplaceDate(res.date,InterventionID);

            //console.log(res.date);
            //this.mon_date=res.date;
          }
          else{console.log('error');}
        },
        err=>console.log('err')
      );
      
  }

  ReplaceDate(date,InterventionID:number){
    for (let i = 0; i < this.plans.length; i++) {
      if(this.plans[i].InterventionID==InterventionID){
        //console.log(this.plans[i]);
        this.plans[i].date_resultat=this.JustDateString(date);
      }
    }
  }

  
JustDateString(date:string){

  if(date==null) return date;
  if (isMoment(date)){
     return date.format('YYYY-MM-DD');
  }
  return date.slice(0,10);
}

loading_reporter_function(InterventionID:number){
 if(this.loading_reporter_InterventionID==InterventionID){
   return true;
 }else{
   false;
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
      type: ['mecanique', 'electrique', 'graissage','hydrolique','pneumatique'],
     // degre: ['faible', 'moyen', 'urgent'],
      //statut: ['enCours', 'ferme']
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

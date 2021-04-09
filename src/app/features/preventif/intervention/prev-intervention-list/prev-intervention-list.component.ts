import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InterventionService } from '../../services/intervention.service';
import { TreeNode } from 'angular-tree-component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-prev-intervention-list',
  templateUrl: './prev-intervention-list.component.html',
  styleUrls: ['./prev-intervention-list.component.scss']
})
export class PrevInterventionListComponent implements OnInit {

  testtest(){
    console.log('testtest');
  }
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ,{url:'gmao/preventif/plans/list',title:'Liste interventions planifiées'}
    ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/intervention',title:'intervention'},
    {url:'',title:'Liste interventions'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  //###############################


   // Pagination && Filter Form -------
  // Pagination
  p: number = 1; total: number; itemsPerPage = 10; loadingFilter: boolean;
  selectedItemPerPage="10";
  // Filter Form 
  rechercheAuto = new FormControl(true);
  //firstDay = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 2);
  filterForm: FormGroup = new FormGroup({
    searchFilterText: new FormControl(),
    //datemin: new FormControl(this.firstDay),
    //datemax: new FormControl(),
    type: new FormControl(['mecanique', 'electrique', 'graissage','hydrolique','pneumatique']),
    parametrage: new FormControl(['planification', 'execution', 'cloture']),
  });
  
  //###################################
  nodes=<any>[]; // SBN
  interventions=<any>[];
  
  constructor(private fb: FormBuilder,private interventionService:InterventionService, private _router:Router
    ,private _notification: MessageService) { }



  
  ngOnInit() {
    this.getInterventions(1);
    this.FilterValuesChanges();
  }

  getInterventions(page: number) {
    this.loadingFilter = true;
    this.interventionService.getInterventions(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;

        //this.me = res.me;
        this.interventions = res.interventions;
        console.log(this.interventions);

      }
    );
  }



  
  ReceptNodes(e){ this.nodes=e; this.auto(); } // SBN
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
    console.log('filter function');
    this.getInterventions(1);
  }
  auto() {
    if (this.rechercheAuto.value == true) {
      this.filter();
    }
  }

  resetFilter() {
    this.filterForm.patchValue({
      searchFilterText: '',
      //datemin: this.firstDay,
      //datemax: '',
      type: ['mecanique', 'electrique', 'graissage','hydrolique','pneumatique'],
      parametrage: ['planification', 'execution', 'cloture'],
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
    //.itemsPerPage = e.target.value;
    this.itemsPerPage = e;
    this.filter();
    
  }

  // New Filter && Pagination #####################################

  routeLink(link){
  this._router.navigate([link]);
  }


  deleteIntervention(InterventionID:number,index:number){
  

        
    this.interventionService.deleteIntervention(InterventionID).then(
      res=>{
        //console.log(res);
        if(res.success){
          this.interventions = this.interventions.filter(d => d.InterventionID !== InterventionID);
          this.notification('success', "L'intervention # "+InterventionID+" est supprimé.", 2000);
        }
      },
      err=>console.log(err)
    );
    
   
  }


  // ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/preventif/bonp/bonp/";
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



  // Table list ----------------------------------------------------
  /*
  data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
*/


  
}



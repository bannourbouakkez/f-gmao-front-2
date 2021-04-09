import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InterventionService } from '../../services/intervention.service';
import { TreeNode } from 'angular-tree-component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-prev-intrevention-list-test',
  templateUrl: './prev-intrevention-list-test.component.html',
  styleUrls: ['./prev-intrevention-list-test.component.scss']
})
export class PrevIntreventionListTestComponent implements OnInit {

  //---------- breadcrumb ---------
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/intervention',title:'intervention'},
    {url:'',title:'Liste interventions'}
  ];
  //###############################


   // Pagination && Filter Form -------
  // Pagination 
  p: number = 1; total: number; itemsPerPage = 5; loadingFilter: boolean;
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
  
  constructor(private fb: FormBuilder,private interventionService:InterventionService) { }



  
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
    this.itemsPerPage = e.target.value;
    this.filter();
  }

  // New Filter && Pagination #####################################



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



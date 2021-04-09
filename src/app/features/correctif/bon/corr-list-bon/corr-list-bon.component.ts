import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CorrBonService } from '../../services/corr-bon.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-corr-list-bon',
  templateUrl: './corr-list-bon.component.html',
  styleUrls: ['./corr-list-bon.component.scss']
})
export class CorrListBonComponent implements OnInit {

  
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/preventif/otp/otps',title:'Liste ordres de travail'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/bon',title:'Bon'},
    {url:'',title:'Liste Bons'}
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
    datemax: new FormControl()   
  });
  //###################################
  bons: any[] = [];
  nodes=<any>[];


  constructor(private corrBonService:CorrBonService) { }

  ngOnInit() {
    this.getBons(1);
    this.FilterValuesChanges();
  }

  getBons(page: number) {
    this.loadingFilter = true;
    this.corrBonService.getBons(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.bons = res.bons;
        console.log(res.bons);
      }
    );
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
  this.getBons(1);
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
    datemax: ''
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

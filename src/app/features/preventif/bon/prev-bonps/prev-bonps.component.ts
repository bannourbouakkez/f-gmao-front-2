import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TreeNode } from 'angular-tree-component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PrevBonpService } from '../../services/prev-bonp.service';

@Component({
  selector: 'app-prev-bonps',
  templateUrl: './prev-bonps.component.html',
  styleUrls: ['./prev-bonps.component.scss']
})
export class PrevBonpsComponent implements OnInit {

  
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
  public filterForm: FormGroup = new FormGroup({
    searchFilterText: new FormControl(),
    datemin: new FormControl(this.firstDay),
    datemax: new FormControl(),
    //type: new FormControl(['mecanique', 'electrique', 'graissage','hydrolique','pneumatique']),
    //statut: new FormControl(['enCours', 'ferme'])
  });
  nodes=<any>[]; // SBN
  bonps=<any>[];
  constructor(public fb: FormBuilder,private bonpService:PrevBonpService) { }

  ngOnInit() {
    this.getBonps(1);
    this.FilterValuesChanges();
  }


  getBonps(page: number) {
    this.loadingFilter = true;
    this.bonpService.getBonps(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                          
        this.total = res.total; this.p = page; this.loadingFilter = false;
        //this.me = res.me;
        this.bonps = res.bonps;
        console.log(this.bonps);
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
    this.getBonps(1);
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
      //type: ['mecanique', 'electrique', 'graissage','hydrolique','pneumatique'],
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
   // this.itemsPerPage = e.target.value;
   this.itemsPerPage = e;
    this.filter();
  }

  // New Filter && Pagination #####################################




}

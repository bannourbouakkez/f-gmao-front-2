import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TreeNode } from 'angular-tree-component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PrevOtpService } from '../../services/prev-otp.service';

@Component({
  selector: 'app-prev-otps',
  templateUrl: './prev-otps.component.html',
  styleUrls: ['./prev-otps.component.scss']
})
export class PrevOtpsComponent implements OnInit {

   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/preventif/bonp/bonps',title:'Liste bons de travail'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/otp',title:'OT'},
    {url:'',title:'Liste OT'}
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
    type: new FormControl(['mecanique', 'electrique', 'graissage','hydrolique','pneumatique']),
    statut: new FormControl(['enCours', 'ferme'])
  });
  nodes=<any>[]; // SBN
  otps=<any>[];
  constructor(private fb: FormBuilder,private otpService:PrevOtpService) { }

  ngOnInit() {
    this.getOtps(1);
    this.FilterValuesChanges();
  }


  getOtps(page: number) {
    this.loadingFilter = true;
    this.otpService.getOtps(page, this.itemsPerPage, this.filterForm.value , this.NodesArrToIdsArr(this.nodes) ).then(
      res => {                                                             // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;

        //this.me = res.me;
        this.otps = res.otps;
        console.log(this.otps);

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
    this.getOtps(1);
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
      statut: ['enCours', 'ferme']
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

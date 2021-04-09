import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { debounceTime , distinctUntilChanged  , map} from 'rxjs/operators';
import { FieldConfig } from 'src/app/features/material/field.interface';
import { DynamicFormComponent } from 'src/app/features/material/components/dynamic-form/dynamic-form.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-liste-articles',
  templateUrl: './liste-articles.component.html',
  styleUrls: ['./liste-articles.component.scss']
})
export class ListeArticlesComponent implements OnInit {

//---------- breadcrumb ---------
autres=[ 
  {url:'gmao/magasin/articles/addoredit',title:'Ajouter Article'}
  //,{url:'gmao/correctif/ot/ots',title:'Liste OTs'}
  //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
  ];
 breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/magasin',title:'magasin'} ,
  {url:'gmao/magasin/article',title:'article'},
  {url:'',title:'Liste Articles'}
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
  filterForm:FormGroup=new FormGroup({
    searchFilterText:new FormControl(),
    famille_id:new FormControl(),
    sous_famille_id:new FormControl(),
    emplacement_id:new FormControl(),
    stock_inf:new FormControl(),
    stock_sup:new FormControl(),
    infalert:new FormControl(),
    infmini:new FormControl(),
    supmaxi:new FormControl(),
    encmd:new FormControl(),
    auto:new FormControl(true)
  });
  //###################################





  articles=<any>[];
  me: any;
  familles=[];
  sousfamilles=[];
  emplacements=[];
  /*
  //-------------
  filterForm:FormGroup=new FormGroup({
    searchFilterText:new FormControl(),
    famille_id:new FormControl(),
    sous_famille_id:new FormControl(),
    emplacement_id:new FormControl(),
    stock_inf:new FormControl(),
    stock_sup:new FormControl(),
    infalert:new FormControl(),
    infmini:new FormControl(),
    supmaxi:new FormControl(),
    encmd:new FormControl(),
    auto:new FormControl(true)
  });
  // ######
  p: number = 1;
*/

  regConfig: FieldConfig[]=[];
  CaraFilter;
  isDynamic=false;
  isValid=false;
  @ViewChild(DynamicFormComponent,{static:true}) form: DynamicFormComponent; 
  eventsSubject: Subject<void> = new Subject<void>();
  emitEventToChild(res) {
  this.eventsSubject.next(res);
  }


  constructor(private articleService:ArticleService) { }

  ngOnInit() {
    this.getArticles(1);
    this.FilterValuesChanges();
    this.getFamilles();
    this.getEmplacements();
  }

  submit(value: any) { this.CaraFilter=value; this.isDynamic=true;}
  isValidFunc(value : any){ this.isValid=value;}

  /*
  getArticles(){
    this.articleService.getArticles().then(
      res=>{console.log(res);this.articles=res;},
      err=>console.log('ListeArticlesComponent:getListeArticle:',err)
    );
  }
  */

  getArticles(page: number) {
    this.loadingFilter = true;
    /*var body={
      staticfilter:this.filterForm.value,
      dynamicfilter:this.CaraFilter
    }*/
    this.articleService.getArticles(page,this.itemsPerPage,this.filterForm.value,this.CaraFilter,1).then(
      res => {                                                             // SBN 
        console.log(res);
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.articles = res.articles;
      }
    );
  }


  roundMath(value){ return (Math.round(value * 1000000)/1000000);}

// New Filter && Pagination ---------------------------------
filter() {
  this.getArticles(1);
  //this.getFamilles();
  //this.getEmplacements();
}
auto() {
  if (this.rechercheAuto.value == true) {
    this.filter();
  }
}

resetFilter(){
  this.filterForm.patchValue({
   searchFilterText:'',
   famille_id:'',
   sous_famille_id:'',
   emplacement_id:'',
   stock_inf:'',
   stock_sup:'',
   infalert:null,
   infmini:null,
   supmaxi:null,
   encmd:null
  });
 
 this.regConfig=[];
 this.CaraFilter=undefined;
 this.familles=[];
 this.sousfamilles=[];

 this.filterForm.setControl('famille_id', new FormControl());
 this.filterForm.setControl('sous_famille_id', new FormControl());

 this.getFamilles();
 this.getEmplacements();

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


  // ==================================> Filter 
  /*
  filter(){
    var body={
      staticfilter:this.filterForm.value,
      dynamicfilter:this.CaraFilter
    }
    console.log(this.filterForm.value);

    this.articleService.filterArticle(body,1).then(
      res=>{ 
        console.log(res);
         this.articles=res; 
        }
      );
   }

 auto(){
   if(this.filterForm.controls['auto'].value==true){
     this.filter();
   }
 }

 resetFilter(){
   this.filterForm.patchValue({
    searchFilterText:'',
    famille_id:'',
    sous_famille_id:'',
    emplacement_id:'',
    stock_inf:'',
    stock_sup:'',
    infalert:null,
    infmini:null,
    supmaxi:null,
    encmd:null
   });
   
  this.regConfig=[];
  this.CaraFilter=undefined;
  this.familles=[];
  this.sousfamilles=[];
  this.filter();
 }


 FilterValuesChanges(){
   this.filterForm.controls.searchFilterText.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.famille_id.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value =>this.auto() );

   this.filterForm.controls.sous_famille_id.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.emplacement_id.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.stock_inf.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.stock_sup.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.infalert.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.infmini.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.supmaxi.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value => this.auto() );

   this.filterForm.controls.encmd.valueChanges
   .pipe(debounceTime(50),distinctUntilChanged())
   .subscribe( value => this.auto() );

 }
 */
 // ###################################



 getFamilles(){
  this.articleService.getFamilles().then(
    res=>{this.familles=res;},
    err=>console.log(err)
  );
}

getEmplacements(){
  this.articleService.getEmplacements().then(
    res=>{this.emplacements=res;},
    err=>console.log(err)
  );
}

SelectFamille(e){
  this.regConfig=[];
  this.CaraFilter=undefined;
  this.sousfamilles=[];
  this.filterForm.setControl('sous_famille_id', new FormControl());

  if(e>0){ this.getListeSousFamilles(e); }
}

getListeSousFamilles(e:number){
  this.articleService.getListeSousFamilles(e).then(
    res=>{
      this.sousfamilles=res;
     // this.Selectsous_famille_id(FamCaraID);
    },
    err=>console.log(err)
  );
}


Selectsous_famille_id(e){
  this.isValid=false;
  let CaraID=e;
  if(CaraID>0){
    if(this.hasCara(CaraID)){
    this.regConfig=[];
    this.getformFilter(CaraID);
    }else{
      this.regConfig=[];
      this.CaraFilter=undefined;
    }
  }else{
  this.regConfig=[];
  this.CaraFilter=undefined;
  }
}

//SelectEmplacement(){

//}


getformFilter(FamCaraID:number){
  this.articleService.getformFilter(FamCaraID).then(
    res=>{
     this.regConfig=res as FieldConfig[];
     this.CaraFilter=this.regConfig;
     //console.log(res);
    },
    err=>console.log('ArtTestFilterComponent:getForm',err)
  );
 }

 hasCara(CaraID:number){
  for (var i = 0;  i<this.sousfamilles.length; i++ ) {
    if(this.sousfamilles[i].FamCaraID==CaraID){
      if(this.sousfamilles[i].hasCara==true){
        return true;
      }
    }
  }
  return false;
}


}

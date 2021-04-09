import { Component, OnInit } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-add-cmd',
  templateUrl: './add-cmd.component.html',
  styleUrls: ['./add-cmd.component.scss']
})
export class AddCmdComponent implements OnInit {
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/achat/cmd/liste',title:'Liste Commandes'}
  ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/cmd',title:'Commande'},
    {url:'',title:'Commander'}
  ];
  
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  pageLoaded=false;
  articlesLoad=false;
  
  fournisseurForm:FormGroup=new FormGroup({
    fournisseur:new FormControl(),
  });
  
  //###############################
  
  fournisseurs=[];
  articles=[];
  cmds=[];
  fournisseur_id:number;
  
  constructor(private _cmdService:CmdService,private _notification: MessageService) { }

  ngOnInit() {
    this.getFournisseurCmde();
  }

  getFournisseurCmde(){
    this._cmdService.getFournisseurCmde().then(
      res=>{
        console.log(res);
        let fs=[];fs=res;
        this.fournisseurs=this.eliminerFZero(fs);
        this.pageLoaded=true;
      },
      err=>console.log('AddCmdComponent:getFournisseurCmde:',err)
    )
  }

  getArticlesCmde(id:number){
    this.articlesLoad=true;
    this._cmdService.getArticlesCmde(id).then(
      res=>{console.log(res);
        this.articles=res;
        for (let i = 0; i < this.articles.length; i++) { 
          this.articles[i]['formControl'] = new FormControl('');
        }
        this.triParDelai();
        this.articlesLoad=false;
      },
      err=>console.log('AddCmdComponent:getArticlesCmde:',err)
    )
  }

  submit(form:NgForm){
    this.newArray();
    var body={
      'fournisseur_id':this.fournisseur_id,
      'cmddaarticles':this.cmds
    }
    if(this.fournisseur_id>0){
      if(this.valideCmd()){
        if(!this.LoadingReactBtn1){
          this.LoadingReactBtn1=true;
      this.addCmd(body);
      this.cmds=[];
      }
      }else{
        this.notification('danger', "Error .", 1500);
        this.cmds=[];}
    }else{
      //alert('Vous devez choisir un fournisseur ! ');
      this.notification('danger', "Select Fournisseur .", 1500);

    }
  }

  addCmd(cmds){
   this._cmdService.addCmd(cmds).then(
     res=>{
       console.log(res);
       this.notification('success', "Commande est ajouté avec succées .", 1500);
       this.articles=[];
       this.cmds=[];
       this.selectFournisseur(this.fournisseur_id);
       this.LoadingReactBtn1=false;
    },
     err=>console.log('AddCmdComponent:addCmd:',err)
     );
  }

  selectFournisseur(e){ console.log(e); this.fournisseur_id=e; if(e>0){ this.getArticlesCmde(e);} if(e==0){this.articles=[];}}

  calculerResteDelai(index){
    let delai=this.articles[index].delai;
    let dateDeCreation =new Date(this.articles[index].created_at); 
    let today=new Date();
    dateDeCreation.setHours(0); dateDeCreation.setMinutes(5); dateDeCreation.setSeconds(0); dateDeCreation.setMilliseconds(0); 
    today.setHours(0); today.setMinutes(5); today.setSeconds(0); today.setMilliseconds(0); 
    let diff= ((today.getTime() - dateDeCreation.getTime())/100000)/864;
    let reste = delai - diff ;
    return Math.round(reste);
  }

  calculerResteDelaiForSort(delai:number,dateDeCreationOrg:string){
    let today=new Date();
    let dateDeCreation = new Date(dateDeCreationOrg); 
    dateDeCreation.setHours(0); dateDeCreation.setMinutes(5); dateDeCreation.setSeconds(0); dateDeCreation.setMilliseconds(0); 
    today.setHours(0); today.setMinutes(5); today.setSeconds(0); today.setMilliseconds(0); 
    let diff= ((today.getTime() - dateDeCreation.getTime())/100000)/864;
    let reste = delai - diff ;
    return reste;
  }

  newArray(){
    for (let i = 0; i < this.articles.length; i++) {
     if(this.isNumber(this.articles[i].formControl.value)){
      let obj = {
         DaArticleID:this.articles[i].id,
         QteCmde:this.articles[i].formControl.value
         };
      this.cmds.push(obj);
     }
    }
  }

  isNumber(value: string | number): boolean
  {
     return ((value != null) &&
             (value !== '') &&
             !isNaN(Number(value.toString())));
   }

  triParDelai(){
    this.articles.sort( (a,b)=> Number(this.calculerResteDelaiForSort(a.delai,a.created_at)) - Number(this.calculerResteDelaiForSort(b.delai,b.created_at)) );
  }

  valideCmd(){
    var isValid=true;
    var ttCmde=0;
    for (var i = 0; i<this.articles.length; i++ ) {
      if(!this.isNumber(this.articles[i].formControl.value) && this.articles[i].formControl.value!=''){
        isValid=false;
      };
               if(
                 ( this.articles[i].formControl.value > this.roundMath(this.articles[i].qte) ) 
                   || 
                 ( this.articles[i].formControl.value < 0 )
                 ) { isValid=false;}
                 ttCmde=ttCmde+this.articles[i].formControl.value;
    }
    if(ttCmde<0){ isValid=false;  }

    // tester si tt vide 
    // ken t7ib 0 ma yet3addéch rodha != méch !==
    var vide = true;
    for (var i = 0; i<this.articles.length; i++ ) { if(this.articles[i].formControl.value!==''){vide=false;} }
    if(vide){isValid=false;}

    return isValid;
  }

  eliminerFZero(fs){
   var i;
   i = fs.length;
   while (i--) {
       if (fs[i].count==0) {
           fs.splice(i, 1);
       }
   }
  return fs;
  }


  roundMath(value){
    return (Math.round(value * 1000000)/1000000);
  }



  viderAll(){
    for (let i = 0; i < this.articles.length; i++) {
       this.articles[i].formControl.setValue('');
      }
  }

  CompletAll(){
    console.log('test');
    
    for (let i = 0; i < this.articles.length; i++) { 
       this.articles[i].formControl.setValue(this.roundMath(this.articles[i].qte ));
      }
    
  }


  // ------ Notification & Redirection  --------------
    /*
    UrlToRedirection="/gmao/preventif/bonp/bonp/";
    redirection(url) {
      this._router.navigate([url]);
    }
    */
    
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

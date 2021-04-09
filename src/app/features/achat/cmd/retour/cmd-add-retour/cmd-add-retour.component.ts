import { Component, OnInit } from '@angular/core';
import { RetourService } from '../../services/retour.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CmdService } from '../../services/cmd.service';
import { FormControl, NgForm } from '@angular/forms';
import { Article } from '../../interfaces/article';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-cmd-add-retour',
  templateUrl: './cmd-add-retour.component.html',
  styleUrls: ['./cmd-add-retour.component.scss']
})
export class CmdAddRetourComponent implements OnInit {
 //---------- breadcrumb ---------
 autres=[ 
  {url:'gmao/achat/cmd/receptions/liste',title:'Liste receptions'}
  ,{url:'gmao/achat/retour/retours/0',title:'Liste retours'}
];
breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/cmd',title:'Retour'},
  {url:'',title:'Retour'}
];
lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
LoadingReactBtn1=false;
pageLoaded=false;

//LoadingReactBtn2=false;
/*
articlesLoad=false;
fournisseurForm:FormGroup=new FormGroup({
  fournisseur:new FormControl(),
});
*/

//###############################

  reception;
  receptiondet=[];
  receptiondetOriginal=[];
  receptiondetsomme=[];
  receptiondetsommeOriginal=[];
  newReceptiondet=[];
  TTRetoursDet=[];

  constructor(private retourService:RetourService,private cmdService:CmdService,private _currentRoute: ActivatedRoute,private _router: Router
    ,private _notification: MessageService
    ) { }

  ngOnInit() {
    let CmdRecID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CmdRecID>0){ // nthabbit yatla3ch null zeda normalement 
      this.getReception(CmdRecID);
    }
  }

  submit(form:NgForm){
    if(this.valideRetour()){
      if(!this.LoadingReactBtn1){
      let causes=form.controls['causes'].value;
      this.newArray();
      this.addRetour(causes);
      this.newReceptiondet=[];
      // Navigate ..
    }
    }else{
      this.notification('danger',"Formulaire pas valide .", 1500);
      this.newReceptiondet=[];
    }
  }

  addRetour(causes){
    this.LoadingReactBtn1=true;
    this.retourService.addRetour(this.reception.CmdRecID,this.newReceptiondet,causes).then(
      res=>{
        
        //console.log(res);
        if(res.success){
        this.notification('success',res.msg, 1500);
        this.redirection(this.UrlToRedirection+res.RetourID);
        }else{
          this.notification('danger',res.msg, 2000);
        }
      },
      err=>console.log('CmdAddRetourComponent:addRetour:',err)
    );
   }

  getReception(CmdRecID:number){
    this.cmdService.getReception(CmdRecID).then(
      res=>{
        this.reception=res.reception;
       // console.log(res);
        this.receptiondet=res.reception_det;
        this.receptiondetOriginal = JSON.parse(JSON.stringify( this.receptiondet ));
        this.receptiondetsomme=this.somme();
        this.receptiondetsommeOriginal=JSON.parse(JSON.stringify( this.receptiondetsomme ));
        this.TTRetoursDet=res.TTRetoursDet;
        
        for (let i = 0; i < this.receptiondetsomme.length; i++) {  this.receptiondetsomme[i]['formControl'] = new FormControl(0);}
      
        this.pageLoaded=true;
      },
      err=>console.log('EditReceptionComponent:getReception:',err)
    )
  }


  newArray(){
    for (let i = 0; i < this.receptiondetsomme.length; i++) {
     if(this.isNumber(this.receptiondetsomme[i].formControl.value)){
      let obj = {
        ArticleID:this.receptiondetsomme[i].ArticleID,
        QteRet:this.receptiondetsomme[i].formControl.value
         };
      
      if(obj.QteRet>0){
      this.newReceptiondet.push(obj);
      }

     }
    }
  }

  somme(){
    let somme:Article[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.receptiondet.length; i++ ) {
     let article_id = this.receptiondet[i].ArticleID;
     if(somme[article_id]){
     somme[article_id].Des=this.receptiondet[i].des;
     somme[article_id].TTQteCmde+=this.receptiondet[i].QteCmde; //console.log(this.receptiondet[i].QteCmde);
     somme[article_id].TTQteRecu+=this.receptiondet[i].QteRecu;
     }else{
       //console.log(this.receptiondet[i].QteCmde);
       somme[article_id]={Des:this.receptiondet[i].des,TTQteCmde:this.receptiondet[i].QteCmde,TTQteRecu:this.receptiondet[i].QteRecu};
     }
    }
    var j=0;
    for (var i = 0;  i<somme.length; i++ ) {
     if(somme[i]){
        let obj = {ArticleID:i,Des:somme[i].Des,TTQteCmde:somme[i].TTQteCmde,TTQteRecu:somme[i].TTQteRecu,open:0};
        sommeRet[j]=obj; j++; 
       } 
    }
    return sommeRet;
   }

    roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }


    isNumber(value: string | number): boolean
    {
       return ((value != null) &&
               (value !== '') &&
               !isNaN(Number(value.toString())));
     }

     ttarecepte(ArticleID:number){
      var ttarec=0;
     for (var i = 0;  i<this.receptiondet.length; i++ ) {
        if(this.receptiondet[i].ArticleID == ArticleID ){
          if( this.isNumber(this.receptiondet[i].formControl.value) ){  ttarec = ttarec + Number(this.receptiondet[i].formControl.value) }
        }
     }
     return ttarec;
    }

    ancienttarecepte(ArticleID:number){
      var ttarec=0;
     for (var i = 0;  i<this.receptiondetOriginal.length; i++ ) {
        if(this.receptiondetOriginal[i].ArticleID == ArticleID ){
           ttarec = ttarec + Number(this.receptiondetOriginal[i].QteRecu) 
        }
     }
     return ttarec;
    }

    valideRetour(){ 
      var isValid=true;
      if(!this.MinimumUnArticle()){isValid=false; console.log('non')}
      else{
      for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
        var ArticleID=this.receptiondetsomme[i].ArticleID;
        var inputValue=this.receptiondetsomme[i].formControl.value;
        if(!this.isNumber(inputValue)){isValid=false;}
        if(
          (inputValue<0)
          ||
          (inputValue > this.roundMath(  this.receptiondetsomme[i].TTQteRecu - this.TTRetoursDet[ArticleID] ) )
          ){isValid=false;}
      }
    }
      return isValid;
    }

    MinimumUnArticle(){
      let isValid=false;
      for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
        var inputValue=this.receptiondetsomme[i].formControl.value;
        if(inputValue>0){isValid=true;}
      }
      return isValid;
    }

    TTRetoursDetFunc(ArticleID){
      if(this.TTRetoursDet[ArticleID]){
        return this.TTRetoursDet[ArticleID];
      }else{
        return 0;
      }
    }

/*
    remiseAZero(){
      for (let i = 0; i < this.receptiondet.length; i++) { 
         this.receptiondet[i].formControl.setValue(0);
        }
    }

    CompletAll(){
      for (let i = 0; i < this.receptiondet.length; i++) { 
         this.receptiondet[i].formControl.setValue(this.roundMath(this.receptiondetOriginal[i].QteCmde - this.receptiondetOriginal[i].TTQteRecu + this.receptiondetOriginal[i].QteRecu));
        }
    }

*/

// ------ Notification & Redirection  --------------
UrlToRedirection="/gmao/achat/retour/retour/";
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



}

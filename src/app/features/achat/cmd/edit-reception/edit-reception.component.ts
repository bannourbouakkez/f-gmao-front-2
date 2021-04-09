import { Component, OnInit } from '@angular/core';
import { Article } from '../interfaces/article';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-edit-reception',
  templateUrl: './edit-reception.component.html',
  styleUrls: ['./edit-reception.component.scss']
})
export class EditReceptionComponent implements OnInit {
     //---------- breadcrumb ---------
     autres=[ 
      {url:'gmao/achat/cmd/receptions/liste',title:'Liste Reception'}
      ,{url:'gmao/achat/cmd/liste',title:'Liste Commandes'}
    ];
    breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/achat',title:'achat'} ,
      {url:'gmao/achat/cmd',title:'Reception'},
      {url:'',title:'Modification Reception'}
    ];

    lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
    LoadingReactBtn1=false;
    cmdLoaded=false;
    /*
    articlesLoad=false;
    fournisseurForm:FormGroup=new FormGroup({
      fournisseur:new FormControl(),
    });
    */
    
    //###############################

  cmd:any;
  reception;
  receptiondet=[];
  receptiondetOriginal=[];
  receptiondetsomme=[];
  receptiondetsommeOriginal=[];
  newReceptiondet=[];
  TTRetoursDet=[];

  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,private _router: Router 
    ,private _notification: MessageService
    ) { }

  ngOnInit() {
    let CmdRecID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CmdRecID>0){ // nthabbit yatla3ch null zeda normalement 
      this.getReception(CmdRecID);
    }
  }


  getReception(CmdRecID:number){
    this.cmdService.getReception(CmdRecID).then(
      res=>{
        console.log(res);
        this.cmd=res.cmd;
        this.reception=res.reception;
        this.receptiondet=res.reception_det;
        this.TTRetoursDet=res.TTRetoursDet;
        this.receptiondetOriginal = JSON.parse(JSON.stringify( this.receptiondet ));
        this.receptiondetsomme=this.somme();
        this.receptiondetsommeOriginal=JSON.parse(JSON.stringify( this.receptiondetsomme ));

        for (let i = 0; i < this.receptiondet.length; i++) {  this.receptiondet[i]['formControl'] = new FormControl(this.receptiondet[i].QteRecu);}
        console.log(res);
        console.log('this.receptiondetsomme: '+JSON.stringify(this.receptiondetsomme));
        
        this.cmdLoaded=true;
        
      },
      err=>console.log('EditReceptionComponent:getReception:',err)
    )
  }

  submit(){
    if(this.valideModifReception()){
      if(!this.LoadingReactBtn1){
        this.LoadingReactBtn1=true;
      this.newArray();
      //console.log(this.newReceptiondet);
      this.ModifierReception();
      this.newReceptiondet=[];
      // Navigate .. 
      }
    }else{ 
      this.newReceptiondet=[];
      this.notification('danger', "Error .", 1500);
    }
  }
  
  ModifierReception(){
   this.cmdService.ModifierReception(this.reception.CmdRecID,this.newReceptiondet,this.reception.rapport).then(
     res=>{
       console.log(res);
       this.notification('success', "Reception est modifiée avec succées .", 1500);
       this.redirection(this.UrlToRedirection+this.reception.CmdRecID);
      },
     err=>console.log('EditReceptionComponent:ModifierReception:',err)
   );
  }

  newArray(){
    for (let i = 0; i < this.receptiondet.length; i++) {
     if(this.isNumber(this.receptiondet[i].formControl.value)){
      let obj = {
        daarticle_id:this.receptiondet[i].daarticle_id,
        QteRecu:this.receptiondet[i].formControl.value
         };
      this.newReceptiondet.push(obj);
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
     somme[article_id].TTQteCmde+=this.receptiondet[i].QteCmde; console.log(this.receptiondet[i].QteCmde);
     somme[article_id].TTQteRecu+=this.receptiondet[i].QteRecu;
     }else{
      console.log(this.receptiondet[i].QteCmde);
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

   TTRetoursDetFunc(ArticleID){
    if(this.TTRetoursDet[ArticleID]){
      return this.TTRetoursDet[ArticleID];
    }else{
      return 0;
    }
  }

   roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }


    changeQteRecu(i:number){
    this.receptiondet[i].TTQteRecu=this.receptiondetOriginal[i].TTQteRecu -  ( this.receptiondetOriginal[i].QteRecu - this.receptiondet[i].formControl.value );
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


    valideModifReception(){
      var isValid=true;
      for (var i = 0;  i<this.receptiondet.length; i++ ) {
        var inputValue=this.receptiondet[i].formControl.value;
        let ArticleID=this.receptiondet[i].ArticleID;

        if(!this.TestLogiqueQteSupQteRet(ArticleID)){
          return false;
        }

        
        if(!this.isNumber(inputValue)){isValid=false;}
        if(
          (inputValue<0)
          ||
          (inputValue > this.roundMath( this.receptiondetOriginal[i].QteCmde - this.receptiondetOriginal[i].TTQteRecu + this.receptiondetOriginal[i].QteRecu ) )
          ){isValid=false;}

        }
      return isValid;
    }

    TTInputValueRecuDunArticle(ArticleID:number){
      let TTInputValueRecuDunArticle=0;
      for (var i = 0;  i<this.receptiondet.length; i++ ) {
        if(this.receptiondet[i].ArticleID == ArticleID){
          TTInputValueRecuDunArticle+=this.receptiondet[i].formControl.value;
        }
      }
      return TTInputValueRecuDunArticle;
    }

    TTQteDejeRecu(ArticleID:number){
      for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
      if(this.receptiondetsomme[i].ArticleID==ArticleID){
        return this.receptiondetsomme[i].TTQteRecu;
      }
      }
    }

    TTQteDejeRecuDeTTRec(ArticleID:number){
      let TTQteDejeRecuDeTTRec=0;
      for (var i = 0;  i<this.receptiondet.length; i++ ) {
      if(this.receptiondet[i].ArticleID==ArticleID){
        TTQteDejeRecuDeTTRec+=this.receptiondet[i].TTQteRecu;
      }
      }
      return TTQteDejeRecuDeTTRec;
    }
   
    TTQteAutreRec(ArticleID:number){
      //receptiondetOriginal[i]

      let TTQteAutreRec=0;
      for (var i = 0;  i<this.receptiondetOriginal.length; i++ ) {
      //console.log(this.receptiondetOriginal[i]);
      if(this.receptiondetOriginal[i].ArticleID==ArticleID){
        TTQteAutreRec+=this.receptiondetOriginal[i].TTQteRecu-this.receptiondetOriginal[i].QteRecu;
      }
      }
     
      //console.log(TTQteAutreRec);
      return TTQteAutreRec;
    }


    TTQteAutreRecDet(ArticleID:number){
      // autre reception de meme demandeur 
      for (var i = 0;  i<this.receptiondetOriginal.length; i++ ) {
        //console.log(this.receptiondetOriginal[i]);
        if(this.receptiondetOriginal[i].ArticleID==ArticleID){
          return this.receptiondetOriginal[i].TTQteRecu-this.receptiondetOriginal[i].QteRecu;
        }
        }
    }

    


    TTQteQmde(ArticleID:number){
      for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
        if(this.receptiondetsomme[i].ArticleID==ArticleID){
          return this.receptiondetsomme[i].TTQteCmde;
        }
        }
    }

    TestLogiqueRetour(ArticleID:number):Boolean{
    let TTRet=+this.TTRetoursDetFunc(ArticleID);
    let TTInputValueRecuDunArticle=+this.TTInputValueRecuDunArticle(ArticleID);
    let TTQteRecuDeja=+this.TTQteDejeRecu(ArticleID); 
    let TTQteQmde=+this.TTQteQmde(ArticleID);
    let TTQteDejeRecuDeTTRec=this.TTQteDejeRecuDeTTRec(ArticleID);
    let TTQteAutreRec=+this.TTQteAutreRec(ArticleID);
    // let TTQteCmde=this.receptiondetOriginal[i].QteCmde
    let comp2= TTQteQmde - TTQteAutreRec - TTRet;

    //console.log( TTInputValueRecuDunArticle+'>'+'('+TTQteQmde+'-'+TTQteAutreRec+'-'+TTRet+'='+comp2+')');

    //console.log("if(TTInputValueRecuDunArticle>comp2) , ("+TTInputValueRecuDunArticle+'>'+comp2+')');
    if(TTInputValueRecuDunArticle>comp2){
     //console.log("if(TTInputValueRecuDunArticle>comp2) , ("+TTInputValueRecuDunArticle+'>'+comp2+')');
     return false;
    }else{
     return true;
    }
   
    }

    TestLogiqueQteSupQteRet(ArticleID:number):Boolean{
      let TTRet=+this.TTRetoursDetFunc(ArticleID);
      let TTInputValueRecuDunArticle=+this.TTInputValueRecuDunArticle(ArticleID);
      if(TTInputValueRecuDunArticle<TTRet){
        return false;
      }else{
        return true;
      }
    }

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


    
// ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/achat/cmd/reception/";
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

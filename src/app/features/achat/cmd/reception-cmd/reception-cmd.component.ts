import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CmdService } from '../services/cmd.service';
import { Article } from '../interfaces/article';
import { FormControl, NgForm } from '@angular/forms';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-reception-cmd',
  templateUrl: './reception-cmd.component.html',
  styleUrls: ['./reception-cmd.component.scss']
})
export class ReceptionCmdComponent implements OnInit {
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/achat/cmd/receptions/liste',title:'Liste Reception'}
    ,{url:'gmao/achat/cmd/liste',title:'Liste Commandes'}
  ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/cmd',title:'Reception'},
    {url:'',title:'Reception'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  LoadingReactBtn2=false;
  pageLoaded=false;
  cmdLoaded=false;
  fermeLoad=false;
  allRecepted=false;
  /*
  articlesLoad=false;
  fournisseurForm:FormGroup=new FormGroup({
    fournisseur:new FormControl(),
  });
  */
  
  //###############################

  cmd;
  cmddet=[];
  cmddetsomme=[];
  reception;
  receptiondet=[];

  
  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,private _router: Router
    ,private _notification: MessageService
    ) { }

  ngOnInit() {
    let CommandeID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CommandeID>0){ // nthabbit yatla3ch null zeda normalement 
      this.getCmd(CommandeID);
    }
  }

  submit(form:NgForm,ferme:number){
    this.newArray();
    console.log(this.receptiondet);
    
    var body={
      'CommandeID':this.cmd.CommandeID,
      'reception_det':this.receptiondet,
      'rapport':form.controls['rapport'].value
    }
      if(this.valideReception()){
        if(!this.LoadingReactBtn1 && !this.LoadingReactBtn2){

      if(ferme==0){this.LoadingReactBtn1=true;}
      if(ferme==1){this.LoadingReactBtn2=true;}
      this.addRec(body,ferme);
      //this._router.navigate(['/achat/cmd/cmd/',this.cmd.CommandeID]);
      this.receptiondet=[];
        }  
    }else{
         this.notification('danger', "Formulaire non valide .", 1500);
         this.receptiondet=[]; 
    }
    
    
  }
  
  addRec(reception,ferme:number){
    this.cmdService.addRec(reception).then(
      res=>{
        console.log(res); 
        if(res.success){
        if(ferme){ this.cmdService.fermerCmd(this.cmd.CommandeID).then(
          resferme=>console.log('ferme : '+resferme),
          errferme=>console.log(errferme)
        ); 
        this.LoadingReactBtn1=false;
        this.LoadingReactBtn2=false;
        this.notification('success',res.msg, 2000);
        this.redirection(this.UrlToRedirection+res.CmdRecID);
        }else{
          this.LoadingReactBtn1=false;
          this.LoadingReactBtn2=false;
          this.notification('success',res.msg, 1500);
          this.redirection(this.UrlToRedirection+res.CmdRecID);
        }
        
      }
       
      },
      err=>console.log('ReceptionCmdComponent:addRec:',err)
      );
  }

  FermeCommande(){
    if(!this.fermeLoad){
    this.fermeLoad=true;
    this.cmdService.fermerCmd(this.cmd.CommandeID).then(
      resferme=>{
        this.notification('success','Commande est férmé .', 2000);
        this.redirection("/gmao/achat/cmd/cmd/"+this.cmd.CommandeID);
        //this.fermeLoad=false;
        //console.log('ferme : '+resferme);
      },
      errferme=>console.log(errferme)
    ); 
    }
  }

  newArray(){
    for (let i = 0; i < this.cmddet.length; i++) {
     if(this.isNumber(this.cmddet[i].formControl.value)){
      let obj = {
        daarticle_id:this.cmddet[i].daarticle_id,
        QteRecu:this.cmddet[i].formControl.value
         };
      this.receptiondet.push(obj);
     }
    }
  }

  getCmd(CommandeID:number){
    this.cmdService.getCmd(CommandeID).then(
      res=>{
        this.cmd=res.cmd[0];
        this.cmddet=res.cmddet;
        this.cmddetsomme=this.somme();
        for (let i = 0; i < this.cmddet.length; i++) {  this.cmddet[i]['formControl'] = new FormControl('');}
        this.cmdLoaded=true;

        this.TesterIfAllrecepted();
       
      },
      err=>console.log('ReceptionCmdComponent:getCmd:',err)
    );
  }
  TesterIfAllrecepted(){
    let TTQteCmde=0;
    let TTQteRecu=0;
    for (let i = 0; i < this.cmddetsomme.length; i++) { 
      TTQteCmde+=this.cmddetsomme[i].TTQteCmde;
      TTQteRecu+=this.cmddetsomme[i].TTQteRecu;
    }
    if(TTQteRecu>=TTQteCmde){this.allRecepted=true;}
  }

  somme(){
    let somme:Article[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.cmddet.length; i++ ) {
     let article_id = this.cmddet[i].article_id;
     if(somme[article_id]){
     somme[article_id].Des=this.cmddet[i].des;
     somme[article_id].TTQteCmde+=this.cmddet[i].QteCmde;
     somme[article_id].TTQteRecu+=this.cmddet[i].TTQteRecu;
     }else{
       somme[article_id]={Des:this.cmddet[i].des,TTQteCmde:this.cmddet[i].QteCmde,TTQteRecu:this.cmddet[i].TTQteRecu};
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

   ttarecepte(ArticleID:number){
     var ttarec=0;
    for (var i = 0;  i<this.cmddet.length; i++ ) {
       if(this.cmddet[i].article_id == ArticleID ){
         if( this.isNumber(this.cmddet[i].formControl.value) ){  ttarec = ttarec + Number(this.cmddet[i].formControl.value) }
       }
    }
    return ttarec;
   }

    isNumber(value: string | number): boolean
    {
       return ((value != null) &&
               (value !== '') &&
               !isNaN(Number(value.toString())));
     }

  valideReception(){ 
    var isValid=true;
    var ttRecu=0;
    for (var i = 0; i<this.receptiondet.length; i++ ) {
      let daarticle_id_receptiondet=this.receptiondet[i].daarticle_id;
         for (var j = 0; j<this.cmddet.length; j++ ) {
           
           let daarticle_id_cmddet=this.cmddet[j].daarticle_id; 
           if(daarticle_id_receptiondet==daarticle_id_cmddet){
               if(
                 ( this.roundMath(this.receptiondet[i].QteRecu) > this.roundMath( this.cmddet[j].QteCmde - this.cmddet[j].TTQteRecu ) ) 
                   || 
                 ( this.receptiondet[i].QteRecu < 0 )
                 ) {isValid=false;}
           }

         }
         ttRecu=ttRecu+this.receptiondet[i].QteRecu;
    }
    if(ttRecu<=0){isValid=false;}
    //console.log(isValid);
    return isValid;
  }

  roundMath(value){
  return (Math.round(value * 1000000)/1000000);
  }

  remiseAZero(){
    for (let i = 0; i < this.cmddet.length; i++) { 
       this.cmddet[i].formControl.setValue(0);
      }
  }

  CompletAll(){
    for (let i = 0; i < this.cmddet.length; i++) { 
       this.cmddet[i].formControl.setValue(this.roundMath(this.cmddet[i].QteCmde - this.cmddet[i].TTQteRecu ));
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

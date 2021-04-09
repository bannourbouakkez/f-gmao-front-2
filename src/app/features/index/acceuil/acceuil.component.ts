import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent implements OnInit {

  constructor(private _authService:AuthService) { }
  Admin:boolean=false;
  Methode:boolean=false;
  ResponsableAchat:boolean=false;
  ResponsableMagasin:boolean=false;
  Other:boolean=false;
  ngOnInit() {
    if(this.isPosts(['Admin'])){this.Admin=true; return ;}
    if(this.isPosts(['Methode'])){this.Methode=true;  return ;}
    if(this.isPosts(['ResponsableAchat'])){this.ResponsableAchat=true;  return ;}
    if(this.isPosts(['ResponsableMagasin'])){this.ResponsableMagasin=true;  return ;}
    this.Other=true; return ;
  }

  isPoste(ExpectedPoste:string){
    return this._authService.isPoste(ExpectedPoste); 
  }

  isPosts(ExpectedPosts){
    let bool=false;
    for(let i=0;i<ExpectedPosts.length;i++){
      if(this.isPoste(ExpectedPosts[i])){ bool=true;}
    }
    return bool;
  }

}

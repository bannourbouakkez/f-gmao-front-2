import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-founisseur-secteurs',
  templateUrl: './founisseur-secteurs.component.html',
  styleUrls: ['./founisseur-secteurs.component.scss']
})
export class FounisseurSecteursComponent implements OnInit {

   
  secteurs=<any>[];
  constructor(private _fournisseursService: FournisseurService,private _router:Router) { }

  ngOnInit() {
    this._fournisseursService.getSecteurs().then(
      res=> this.secteurs=res,
      err=> console.log("FounisseurSecteursComponent:ngOnInit:"+err)
    )
  }

  edit(i:number){
    this._router.navigate(['/achat/secteurs/addoredit',i]);
  }
 
  delete(id:number,i:number){
    this._fournisseursService.deleteSecteur(id).then(
      res=>{ if(res=true){this.secteurs.splice(i,1);} },
      err=> console.log("FounisseurSecteursComponent:delete:"+err)
    );
  }
  
  






  


}

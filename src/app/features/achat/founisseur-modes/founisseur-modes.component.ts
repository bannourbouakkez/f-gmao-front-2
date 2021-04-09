import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-founisseur-modes',
  templateUrl: './founisseur-modes.component.html',
  styleUrls: ['./founisseur-modes.component.scss']
})
export class FounisseurModesComponent implements OnInit {
  
  modes=<any>[];
  constructor(private _fournisseursService: FournisseurService,private _router:Router) { }

  ngOnInit() {
    this._fournisseursService.getModes().then(
      res=> this.modes=res,
      err=> console.log("FounisseurModesComponent:ngOnInit:"+err)
    )
  }

  edit(i:number){
    this._router.navigate(['/achat/modes/addoredit',i]);
  }

  delete(id:number,i:number){
    this._fournisseursService.deleteMode(id).then(
      res=>{ if(res=true){this.modes.splice(i,1);} },
      err=> console.log("FounisseurModesComponent:delete:"+err)
    );
  }

}

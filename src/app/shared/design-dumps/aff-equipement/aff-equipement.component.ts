import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aff-equipement',
  templateUrl: './aff-equipement.component.html',
  styleUrls: ['./aff-equipement.component.scss']
})
export class AffEquipementComponent implements OnInit {
  
  @Input() niveaux:any[];  
  @Input() type:any;

  //constructor() { }
  
  ngOnInit() {}

}

import { Component, OnInit, Input, Output , EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OutilService } from '../../services/outil.service';

@Component({
  selector: 'app-mag-dump-intervenants',
  templateUrl: './mag-dump-intervenants.component.html',
  styleUrls: ['./mag-dump-intervenants.component.scss']
})
export class MagDumpIntervenantsComponent implements OnInit {

  @Input() intervenants:any[];
  //@Input() OutilID:number;
  @Input() ListeValueIntervenants:any[];
  @Output() ListeValueIntervenantsEmitted = new EventEmitter(); 
 
  ListeValueIntervenantsToEmitted=<any>[];
  Form:FormGroup;
  constructor(private outilService:OutilService,private fb:FormBuilder) { }

  ngOnInit() {
    this.Form=this.fb.group({ListeValueIntervenantsFormControl:['']});
    this.Form.patchValue({ListeValueIntervenantsFormControl:this.ListeValueIntervenants});
  }
  
  change(e) {
    this.ListeValueIntervenantsToEmitted=e.value;
    this.ListeValueIntervenantsEmitted.emit(this.ListeValueIntervenantsToEmitted);  // Déclenche l'output
  }
}

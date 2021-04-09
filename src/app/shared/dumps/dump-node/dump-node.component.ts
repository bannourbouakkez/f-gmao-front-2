import { Component, OnInit, Output , EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-dump-node',
  templateUrl: './dump-node.component.html',
  styleUrls: ['./dump-node.component.scss']
})
export class DumpNodeComponent implements OnInit {

  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @Input() id:number;  
  @Input() name:string;
  @Input() x:boolean;
  constructor() { }
  
  ngOnInit() {}
  
  Action(){this.action.emit(this.id);}

}

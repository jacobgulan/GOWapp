import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.css']
})
export class HexComponent implements OnInit {
  @Input() color!: string;
  @Input() text!: string;
  @Input() id!: string;

  
  constructor() { }

  ngOnInit(): void {
  }

  onClick(text: string){
    if(Number(text)){
      console.log(parseInt(text));
    }else{
      console.log(text);
    }
  }
}

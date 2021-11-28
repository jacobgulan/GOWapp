import { Component, OnInit } from '@angular/core';
import { DragScrollModule } from 'ngx-drag-scroll';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.css'],
  providers: [DragScrollModule],
})
export class HowToPlayComponent implements OnInit {

  constructor() {
   }
  ngOnInit(): void {
  }

}

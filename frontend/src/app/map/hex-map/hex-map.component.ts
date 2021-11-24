import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HexComponent } from '../hex/hex.component';

@Component({
  selector: 'app-hex-map',
  templateUrl: './hex-map.component.html',
  styleUrls: ['./hex-map.component.css'],
})
export class HexMapComponent implements OnInit {
  grassColor: string = '#536722';
  waterColor: string = '#375353';
  map: number = 1;
  allHexes!: Array<HexComponent>;
  content!: any;
  currHex = -1;
  nextHex = -1;
  firingHex = -1;
  firing = false;
  @ViewChild('movement') movement!: ElementRef;
  @ViewChild('fire') fire!: ElementRef;
  @ViewChild('reload') reload!: ElementRef;
  @ViewChild('confirm') confirmed!: ElementRef;

  constructor(
    private elRef: ElementRef) {
      localStorage.setItem('moving','false');
     }

  ngOnInit(): void { 
  }

  ngAfterContentInit(){

  }

  ngAfterViewInit() {
    this.fire.nativeElement.addEventListener('click', this.fireParagraph);
    this.reload.nativeElement.addEventListener('click', this.reloadParagraph);
    this.confirmed.nativeElement.addEventListener('click', this.confirm);
    this.movement.nativeElement.addEventListener('click', this.movementParagraph);
  }

  getHex(e: any){
    let target = e.target.textContent;
    if(!isNaN(target)){
      this.activate(parseInt(target));
    }
    else if (target.indexOf('water') == -1 && target.indexOf('woods') == -1){
      this.activate(target);
    }

  }

  /* Jacobs code */
  // Text for movement
  movementParagraph() {
    let para = document.createElement('p');

    if (this.firing) {
      para.textContent = 'Please deselect firing action';
      document.getElementById('logInfo')?.appendChild(para);
      return;
    }

    if (localStorage.getItem('moving')=='false') {
      // TODO: Implement as disappearing message
      para.textContent = 'Movement action selected';
      document.getElementById('logInfo')?.appendChild(para);
      localStorage.setItem('moving','true');
    } else {
      para.textContent = 'Movement action deselected';
      document.getElementById('logInfo')?.appendChild(para);
      localStorage.setItem('moving','false');

    }
  }

  // Text for firing
  fireParagraph() {
    let para = document.createElement('p');
    if (localStorage.getItem('moving')=='true') {
      para.textContent = 'Please deselect movement action';
      document.getElementById('logInfo')?.appendChild(para);
      return;
    }

    if (!this.firing) {
      // TODO: Implement as disappearing message
      para.textContent = 'Fire action selected';
      document.getElementById('logInfo')?.appendChild(para);
      this.firing = true;
    } else {
      para.textContent = 'Fire action deselected';
      document.getElementById('logInfo')?.appendChild(para);
      this.firing = false;
    }
  }

  // Text for reload
  reloadParagraph() {
    let para = document.createElement('p');

    if (localStorage.getItem('moving')=='true') {
      para.textContent = 'Please deselect movement action';
      document.getElementById('logInfo')?.appendChild(para);
      return;
    } else if (this.firing) {
      para.textContent = 'Please deselect firing action';
      document.getElementById('logInfo')?.appendChild(para);
      return;
    } else {
      para.textContent = 'Reloaded gun';
      document.getElementById('logInfo')?.appendChild(para);
    }
  }

  // Confirm action (does not confirm reload)
  confirm() {
    let para = document.createElement('p');
    if (localStorage.getItem('moving')=='true') {
      para.textContent =
        'Moved from Hex ' + this.currHex + ' to Hex ' + this.nextHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.currHex = this.nextHex;
      this.nextHex = -1;
      localStorage.setItem('moving','false');
    } else if (this.firing) {
      para.textContent =
        'Fired at Hex ' + this.firingHex + ' from Hex ' + this.currHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.firing = false;
      this.firingHex = -1;
    } else {
      // TODO: Implement as disappearing text
      para.textContent = 'Please select an action first';
      document.getElementById('logInfo')?.appendChild(para);
    }
  }

  // Activate hex
  activate(hexNum: any) {
    let para = document.createElement('p');
    var moving = localStorage.getItem('moving')
    if (this.currHex == -1) {	// Select starting location
      this.currHex = hexNum
      para.textContent = ('Starting at Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
    } else if (this.nextHex == hexNum && moving =='true') {	// Deselect hex to move to
      this.nextHex = -1
      para.textContent = ('Deactivated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
    } else if (this.nextHex != hexNum && moving =='true') {	// Select hex to move to
      this.nextHex = hexNum
      para.textContent = ('Activated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
    } else if (this.firingHex == hexNum && this.firing) {	// Deselect hex to fire at
      this.firingHex = -1
      para.textContent = ('Deactivated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
    } else if (this.firingHex != hexNum && this.firing) {		// Select hex to fire at
      this.firingHex = hexNum
      para.textContent = ('Activated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
    } else {	// Ignore input
      para.textContent = ('Please select an action first');
      document.getElementById('logInfo')?.appendChild(para);
    }

  }
}

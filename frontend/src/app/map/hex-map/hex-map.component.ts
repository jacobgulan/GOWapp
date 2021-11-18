import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
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
  moving = false;
  firing = false;
  @ViewChild('movement') movement!: ElementRef;
  @ViewChild('fire') fire!: ElementRef;
  @ViewChild('reload') reload!: ElementRef;
  @ViewChild('confirm') confirmed!: ElementRef;
  @ViewChild('test') test!: ElementRef;

  constructor(
    private elRef: ElementRef) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.getAllHexes(); /* This method has to come first */
    this.movement.nativeElement.addEventListener(
      'click',
      this.movementParagraph
    );
    this.fire.nativeElement.addEventListener('click', this.fireParagraph);
    this.reload.nativeElement.addEventListener('click', this.reloadParagraph);
    this.confirmed.nativeElement.addEventListener('click', this.confirm);
  }

  getAllHexes() {
    this.allHexes = this.elRef.nativeElement.querySelectorAll('app-hex');
    //console.log(this.allHexes);
  }

  getSpecficHex(index: number) {
    if (index < this.allHexes.length) {
      let hex = this.allHexes[index];
      console.log(hex);
    }
  }

  getSniperSpawnPoints() {
    let sniperSpawns =
      this.elRef.nativeElement.querySelectorAll('.sniperSpawn');
    console.log(sniperSpawns);
  }

  getId(e: any) {
    this.activate(e);
  }

  /* Jacobs code */
  // Text for movement
  movementParagraph() {
    let para = document.createElement('p');

    if (this.firing) {
      para.textContent = 'Please deselect firing action';
      document.body.appendChild(para);
      return;
    }

    if (!this.moving) {
      // TODO: Implement as disappearing message
      para.textContent = 'Movement action selected';
      document.body.appendChild(para);

      this.moving = true;
    } else {
      para.textContent = 'Movement action deselected';
      document.body.appendChild(para);
      this.moving = false;
    }
  }

  // Text for firing
  fireParagraph() {
    let para = document.createElement('p');
    if (this.moving) {
      para.textContent = 'Please deselect movement action';
      document.body.appendChild(para);
      return;
    }

    if (!this.firing) {
      // TODO: Implement as disappearing message
      para.textContent = 'Fire action selected';
      document.body.appendChild(para);
      this.firing = true;
    } else {
      para.textContent = 'Fire action deselected';
      document.body.appendChild(para);
      this.firing = false;
    }
  }

  // Text for reload
  reloadParagraph() {
    let para = document.createElement('p');

    if (this.moving) {
      para.textContent = 'Please deselect movement action';
      document.body.appendChild(para);
      return;
    } else if (this.firing) {
      para.textContent = 'Please deselect firing action';
      document.body.appendChild(para);
      return;
    } else {
      para.textContent = 'Reloaded gun';
      document.body.appendChild(para);
    }
  }

  // Confirm action (does not confirm reload)
  confirm() {
    let para = document.createElement('p');
    if (this.moving) {
      para.textContent =
        'Moved from Hex ' + this.currHex + ' to Hex ' + this.nextHex;
      document.body.appendChild(para);
      this.currHex = this.nextHex;
      this.nextHex = -1;
      this.moving = false;
    } else if (this.firing) {
      para.textContent =
        'Fired at Hex ' + this.firingHex + ' from Hex ' + this.currHex;
      document.body.appendChild(para);
      this.firing = false;
      this.firingHex = -1;
    } else {
      // TODO: Implement as disappearing text
      para.textContent = 'Please select an action first';
      document.body.appendChild(para);
    }
  }

  // Activate hex
  activate(hexNum: any) {
    let para = document.createElement('p');

    if (this.currHex == -1) {	// Select starting location
      this.currHex = hexNum
      para.textContent = ('Starting at Hex ' + hexNum);
      document.body.appendChild(para);
    } else if (this.nextHex == hexNum && this.moving) {	// Deselect hex to move to
      this.nextHex = -1
      para.textContent = ('Deactivated Hex ' + hexNum);
      document.body.appendChild(para);
    } else if (this.nextHex != hexNum && this.moving) {	// Select hex to move to
      this.nextHex = hexNum
      para.textContent = ('Activated Hex ' + hexNum);
      document.body.appendChild(para);
    } else if (this.firingHex == hexNum && this.firing) {	// Deselect hex to fire at
      this.firingHex = -1
      para.textContent = ('Deactivated Hex ' + hexNum);
      document.body.appendChild(para);
    } else if (this.firingHex != hexNum && this.firing) {		// Select hex to fire at
      this.firingHex = hexNum
      para.textContent = ('Activated Hex ' + hexNum);
      document.body.appendChild(para);
    } else {	// Ignore input
      para.textContent = ('Please select an action first');
      document.body.appendChild(para);
    }

  }
}

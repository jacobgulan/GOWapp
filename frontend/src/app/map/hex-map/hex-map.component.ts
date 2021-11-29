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
    this.fire.nativeElement.addEventListener('click', this.fireParagraph.bind(this));
    this.reload.nativeElement.addEventListener('click', this.reloadParagraph.bind(this));
    this.confirmed.nativeElement.addEventListener('click', this.confirm.bind(this));
    this.movement.nativeElement.addEventListener('click', this.movementParagraph.bind(this));
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

    if (this.currHex == -1) {
      this.showAlert("Please select starting position first");
      return;
    }

    if (this.firing) {
      this.showAlert("Please deselect fire action")
      return;
    }

    if (localStorage.getItem('moving')=='false') {
      para.textContent = 'Movement action selected';
      document.getElementById('logInfo')?.appendChild(para);
      this.changeColor();
      localStorage.setItem('moving','true');
      this.hideAlert()
      
    } else {
      para.textContent = 'Movement action deselected';
      document.getElementById('logInfo')?.appendChild(para);
      this.changeColor();
      localStorage.setItem('moving','false');
      this.hideAlert()
    }
  }

  // Text for firing
  fireParagraph() {
    let para = document.createElement('p');

    if (this.currHex == -1) {
      this.showAlert("Please select starting position first");
      return;
    }

    if (localStorage.getItem('moving')=='true') {
      this.showAlert("Please deselect movement action")
      return;
    }

    if (!this.firing) {
      para.textContent = 'Fire action selected';
      document.getElementById('logInfo')?.appendChild(para);
      this.firing = true;
      this.hideAlert()

    } else {
      para.textContent = 'Fire action deselected';
      document.getElementById('logInfo')?.appendChild(para);
      this.firing = false;
      this.hideAlert()
    }
  }

  // Text for reload
  reloadParagraph() {
    let para = document.createElement('p');

    if (this.currHex == -1) {
      this.showAlert("Please select starting position first");
      return;
    }

    if (localStorage.getItem('moving')=='true') {
      this.showAlert("Please deselect movement action")
      return;
    } else if (this.firing) {
      this.showAlert("Please deselect fire action")
      return;
    } else {
      para.textContent = ('Reloaded gun');
      document.getElementById('logInfo')?.appendChild(para);
      this.hideAlert()
    }
  }

  // Confirm action (does not confirm reload)
  confirm() {
    let para = document.createElement('p');

    if (this.currHex == -1) {
      this.showAlert("Please select starting position first");
      return;
    }

    if (localStorage.getItem('moving')=='true') {
      if (this.nextHex == -1) {
        this.showAlert("Please select hex to move to");
        return;
      }
      para.textContent =
        'Moved from Hex ' + this.currHex + ' to Hex ' + this.nextHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.currHex = this.nextHex;
      this.nextHex = -1;
      localStorage.setItem('moving','false');
      this.hideAlert()
      this.changeColor();

    } else if (this.firing) {
      if (this.firingHex == -1) {
        this.showAlert("Please select hex to fire at");
        return;
      }
      para.textContent =
        'Fired at Hex ' + this.firingHex + ' from Hex ' + this.currHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.firing = false;
      this.firingHex = -1;
      this.hideAlert()

    } else {
      this.showAlert("Please select an action first")
    }
  }

  // Activate hex
  activate(hexNum: any) {
    let para = document.createElement('p');
    var moving = localStorage.getItem('moving');

    if (this.currHex == -1) {	// Select starting location
      // Restrict to sniper spawn points
      if ((hexNum == "sniperSpawn(1)") || (hexNum == "sniperSpawn(2)") ||
          (hexNum == "sniperSpawn(3)") || (hexNum == "sniperSpawn(4)")) {
            this.currHex = hexNum
            para.textContent = ('Starting at Hex ' + hexNum);
            document.getElementById('logInfo')?.appendChild(para);
            this.hideAlert()
      } else {
        this.showAlert("Please select sniper spawn point")
      }

    } else if (this.nextHex == hexNum && moving =='true') {	// Deselect hex to move to
      this.nextHex = -1
      para.textContent = ('Deactivated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);

    } else if (this.nextHex != hexNum && moving =='true') {	// Select hex to move to
      this.nextHex = hexNum
      para.textContent = ('Activated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
      this.hideAlert()

    } else if (this.firingHex == hexNum && this.firing) {	// Deselect hex to fire at
      this.firingHex = -1
      para.textContent = ('Deactivated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);

    } else if (this.firingHex != hexNum && this.firing) {		// Select hex to fire at
      this.firingHex = hexNum
      para.textContent = ('Activated Hex ' + hexNum);
      document.getElementById('logInfo')?.appendChild(para);
      this.hideAlert()

    } else {	// Ignore input
      this.showAlert("Please select an action first")
    }    

  }

  showAlert(msg: any) {
    var alertBox = document.getElementById('alert');
    var errorMsg = document.getElementById('error');
    alertBox!.style.visibility = "visible";
    errorMsg!.innerHTML = msg;
  }

  hideAlert() {
    var alertBox = document.getElementById('alert');
    alertBox!.style.visibility = 'hidden';
  }

  changeColor() {
    let button = document.getElementById('movement');
    if(button?.className == 'active'){
      button.style.backgroundColor = 'red';
      button.classList.remove('active');
    }
    else {
      button!.style.backgroundColor = '#317efb';
      button?.classList.add('active');
    }
  }

}

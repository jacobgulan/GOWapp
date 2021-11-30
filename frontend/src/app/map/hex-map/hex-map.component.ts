import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  currentTurn = 1;
  @ViewChild('movement') movement!: ElementRef;
  @ViewChild('fire') fire!: ElementRef;
  @ViewChild('reload') reload!: ElementRef;
  @ViewChild('confirm') confirmed!: ElementRef;
  @ViewChild('nextTurn') nextTurn!: ElementRef;
  subscription : Subscription;
  browserRefresh: boolean = false;
  constructor(
    private elRef: ElementRef,private router: Router) {
      this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.browserRefresh = !router.navigated;
          if(this.browserRefresh){
            window.location.reload();
          }
        }
      });
      localStorage.setItem('moving','false');
     }

  ngOnInit(): void { 
    var mapno = localStorage.getItem('map')
    if(mapno != null){
      this.map = parseInt(mapno);
    }
    else{
      this.map = 1;
    }
  }

  ngAfterContentInit(){

  }

  ngAfterViewInit() {
    this.fire.nativeElement.addEventListener('click', this.fireParagraph.bind(this));
    this.reload.nativeElement.addEventListener('click', this.reloadParagraph.bind(this));
    this.confirmed.nativeElement.addEventListener('click', this.confirm.bind(this));
    this.movement.nativeElement.addEventListener('click', this.movementParagraph.bind(this));
    this.nextTurn.nativeElement.addEventListener('click', this.next.bind(this));
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
      this.changeColor('movement');
      localStorage.setItem('moving','true');
      this.hideAlert()
      
    } else {
      this.changeColor('movement');
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
      this.changeColor('fire');
      this.firing = true;
      this.hideAlert()
      var audio = new Audio("/assets/fire.mp3");
      audio.play();

    } else {
      this.changeColor('fire');
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
      para.textContent = ('turn ' + this.currentTurn +': Reloaded gun');
      document.getElementById('logInfo')?.appendChild(para);
      this.hideAlert();
      this.changeColor('reload');

      setTimeout(() => {  this.changeColor('reload'); }, 800);
      var audio = new Audio("/assets/reload.mp3");
      audio.play();
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
      this.setSniperPos(this.currHex, this.nextHex);
      para.textContent =
      'turn ' + this.currentTurn +': Moved from Hex ' + this.currHex + ' to Hex ' + this.nextHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.currHex = this.nextHex;
      this.nextHex = -1;
      localStorage.setItem('moving','false');
      this.hideAlert()
      this.changeColor('movement');
      this.changeColor('confirm');
      setTimeout(() => {  this.changeColor('confirm'); }, 800);

    } else if (this.firing) {
      if (this.firingHex == -1) {
        this.showAlert("Please select hex to fire at");
        return;
      }
      para.textContent =
      'turn ' + this.currentTurn +': Fired at Hex ' + this.firingHex + ' from Hex ' + this.currHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.firing = false;
      this.firingHex = -1;
      this.hideAlert()
      this.changeColor('fire');
      this.changeColor('confirm');
      setTimeout(() => {  this.changeColor('confirm'); }, 800);

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
            para.textContent = ('turn ' + this.currentTurn +': Starting at Hex ' + hexNum);
            this.setSniperPos(-1, hexNum);
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

  setSniperPos(preHex: any, nextHex: any){
    let para = document.createElement('p');
    let next = document.getElementById(nextHex)?.firstChild;
    let pre = document.getElementById(preHex)?.firstChild
    para.textContent = 'SNIPER'
    if(preHex == -1){
      next?.appendChild(para);
    }
    else {
      pre?.lastChild?.remove();
      next?.appendChild(para);
    }
  }

  changeColor(action: any) {
    let button = document.getElementById(action);
    if(button?.className == 'active'){
      button.style.backgroundColor = 'red';
      button.classList.remove('active');
    }
    else {
      button!.style.backgroundColor = '#317efb';
      button?.classList.add('active');
    }
  }
  next() {
    this.currentTurn += 1;
  }


}

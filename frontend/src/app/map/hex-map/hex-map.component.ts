import { style } from '@angular/animations';
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
  oldHex = -1;
  @ViewChild('movement') movement!: ElementRef;
  @ViewChild('fire') fire!: ElementRef;
  @ViewChild('reload') reload!: ElementRef;
  @ViewChild('confirm') confirmed!: ElementRef;
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

      if (this.oldHex != -1) {
        this.changeGridColor(this.oldHex)
      }
      this.oldHex = -1;
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

    } else {
      this.changeColor('fire');
      this.firing = false;
      this.hideAlert()

      if (this.oldHex != -1) {
        this.changeGridColor(this.oldHex)
      }
      this.oldHex = -1;
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
      para.textContent = ('Action ' + this.currentTurn +': Reloaded gun');
      document.getElementById('logInfo')?.appendChild(para);
      this.hideAlert();
      this.changeColor('reload');
      this.next();

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

      this.changeGridColor(this.nextHex);
      this.setSniperPos(this.currHex, this.nextHex);
      para.textContent =
      'Action ' + this.currentTurn +': Moved from Hex ' + this.currHex + ' to Hex ' + this.nextHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.currHex = this.nextHex;
      this.oldHex = -1;
      this.nextHex = -1;
      localStorage.setItem('moving','false');
      this.hideAlert();
      this.next();
      this.changeColor('movement');
      this.changeColor('confirm');
      setTimeout(() => {  this.changeColor('confirm'); }, 800);

    } else if (this.firing) {
      if (this.firingHex == -1) {
        this.showAlert("Please select hex to fire at");
        return;
      }
      
      para.textContent =
      'Action ' + this.currentTurn +': Fired at Hex ' + this.firingHex + ' from Hex ' + this.currHex;
        document.getElementById('logInfo')?.appendChild(para);
      this.firing = false;
      this.changeGridColor(this.firingHex);
      this.firingHex = -1;
      this.oldHex = -1;
      this.hideAlert()
      this.changeColor('fire');
      this.changeColor('confirm');
      this.next();
      var audio = new Audio("/assets/fire.mp3");
      audio.play();
      setTimeout(() => {  this.changeColor('confirm'); }, 800);
      

    } else {
      this.showAlert("Please select an action first")
    }
  }

  // Activate hex
  activate(hexNum: any) {
    let para = document.createElement('p');
    var moving = localStorage.getItem('moving');
    console.log(hexNum)

    if (this.currHex == -1) {	// Select starting location
      // Restrict to sniper spawn points
      if ((hexNum == "sniperSpawn(1)") || (hexNum == "sniperSpawn(2)") ||
          (hexNum == "sniperSpawn(3)") || (hexNum == "sniperSpawn(4)")) {
            this.currHex = hexNum
            para.textContent = ('Action ' + this.currentTurn +': Starting at Hex ' + hexNum);
            this.currentTurn += 1;
            this.setSniperPos(-1, hexNum);
            document.getElementById('logInfo')?.appendChild(para);
            this.hideAlert()
      } else {
        this.showAlert("Please select sniper spawn point")
      }

    } else if (this.nextHex == hexNum && moving =='true') {	// Deselect hex to move to
      this.nextHex = -1;
      this.oldHex = -1;
      //this.deactivateHex(hexNum);
      this.changeGridColor(hexNum);
      document.getElementById('logInfo')?.appendChild(para);
      

    } else if (this.nextHex != hexNum && moving =='true') {	// Select hex to move to
      if (this.oldHex != -1) {
        this.changeGridColor(this.oldHex)
      }
      this.oldHex = hexNum;
      
      //this.activateHex(hexNum);
      this.nextHex = hexNum;
      this.changeGridColor(hexNum);
      this.hideAlert()
      document.getElementById('logInfo')?.appendChild(para);

    } else if (this.firingHex == hexNum && this.firing) {	// Deselect hex to fire at
      this.firingHex = -1;
      this.oldHex = -1;
      
      this.changeGridColor(hexNum);
      document.getElementById('logInfo')?.appendChild(para);

    } else if (this.firingHex != hexNum && this.firing) {		// Select hex to fire at
      this.firingHex = hexNum
      if (this.oldHex != -1) {
        this.changeGridColor(this.oldHex)
      }
      this.oldHex = hexNum;
      this.changeGridColor(hexNum);
      this.hideAlert()
      document.getElementById('logInfo')?.appendChild(para);

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
      console.log(pre?.lastChild)
      pre?.lastChild?.remove();
      if (pre?.lastChild?.textContent == "ACTIVE") {
        pre?.lastChild?.remove();
      }
      console.log(pre?.lastChild)
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

  changeGridColor(hex: any) {
    let activated = document.getElementById(hex);

    if (activated!.style.color == 'maroon') {
      activated!.style.color = 'black';
    } else {
      activated!.style.color = 'maroon';
    }
      
  }

  next() {
    this.currentTurn += 1;
  }

  getCard(e: any){
    e.preventDefault();
    let card =  e.target.textContent;
    if(card == ''){
      card = e.target.alt;
    }

    // Make sure other actions are not selected
    if (this.currHex == -1) {
      this.showAlert("Please select starting position first");
      return;
    }

    if (this.firing) {
      this.showAlert("Please deselect fire action")
      return;
    }

    if (localStorage.getItem('moving')=='true') {
      this.showAlert("Please deselect movement action")
      return;
    }

    let para = document.createElement('p');
    para.textContent = ('Action ' + this.currentTurn +': Card selected: ' + card);
    this.next();
    document.getElementById('logInfo')?.appendChild(para);
  }

  /*
  activateHex(hex: any){
    let para = document.createElement('p');
    let activate = document.getElementById(hex)?.firstChild;
    para.textContent = 'ACTIVE'
    activate?.appendChild(para);
*/

    //console.log(active);
    
    /*
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
*/
/*
  deactivateHex(hex: any){
    let para = document.createElement('p');
    let deactivate = document.getElementById(hex)?.firstChild;
    console.log("Method: " + deactivate)
    if (deactivate?.lastChild?.textContent == hex + 'ACTIVE') {
      deactivate?.lastChild?.remove();
    }
  }
  */
}

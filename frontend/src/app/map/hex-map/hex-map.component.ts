import { Component, ElementRef, OnInit,} from '@angular/core';

@Component({
  selector: 'app-hex-map',
  templateUrl: './hex-map.component.html',
  styleUrls: ['./hex-map.component.css']
})
export class HexMapComponent implements OnInit {
  grassColor: string = "#536722";
  waterColor: string = "#375353";
  map: number = 1;
  allHexes!: Array<any>

  constructor(private elRef:ElementRef) { 

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getAllHexes(); /* This method has to come first */
    //this.getSniperSpawnPoints();
    this.getSpecficHex(2);
  }

  getAllHexes(){
    this.allHexes = this.elRef.nativeElement.querySelectorAll('app-hex');
    //console.log(this.allHexes);
  }
  
  getSpecficHex(index: number) {
    if(index < this.allHexes.length){
      let hex = this.allHexes[index];
      console.log(hex);
    }
  }
  
  getSniperSpawnPoints() {
    let sniperSpawns = this.elRef.nativeElement.querySelectorAll('.sniperSpawn');
    console.log(sniperSpawns);
  }
}

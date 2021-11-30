import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * constructor
   */
  public constructor(private titleService: Title,private modalService: NgbModal, private router: Router) {
    this.titleService.setTitle('GOW')
  }
  title = 'GOW';
  closeResult = '';
  form = new FormGroup({
    "mapId": new FormControl("Map1",Validators.required)
  })
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    const queryParam = this.form.value;
    console.log(queryParam);
    localStorage.setItem('map',queryParam.mapId);
    if(this.router.url=='/game'){
      window.location.reload();
    }
    this.router.navigate(['/game'],{state:{data:'queryParam'}});
    }, (reason) => {
    });
  }
}

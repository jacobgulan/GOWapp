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
    "playerCount": new FormControl("",Validators.required)
  })
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    const queryParam = this.form.value;
    console.log(queryParam);
    this.router.navigate(['/game'],{state:{data:'queryParam'}});
    }, (reason) => {
    });
  }
}

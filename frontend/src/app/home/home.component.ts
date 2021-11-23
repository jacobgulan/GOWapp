import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form = new FormGroup({
    "playerCount": new FormControl("",Validators.required)
  })
  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  onClickMe() {
    // alert('hi')
    // localStorage.setItem('whatever', 'something');
    // const queryParam = this.form.value;
    // console.log(this.form.value.playerCount);
    this.router.navigate(['/game'],{state:{data:'queryParam'}});
  }
}

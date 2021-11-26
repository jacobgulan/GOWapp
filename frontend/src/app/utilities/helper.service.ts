export class HelperService {
  
    constructor(
     ) { }
  
     showAlert(msg: any) {
        var alertBox = document.getElementById('alert');
        var errorMsg = document.getElementById('error');
        alertBox!.style.visibility = "visible";
        errorMsg!.innerHTML = msg;
      }
}
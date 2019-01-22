import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from '../../sevises/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('phone_number') phone_number;
  model: any;
  loading: boolean;
  error: string;
  confirmation = false;
  confirmation_code: string;
  username_taken = false;
  refferal_exist = true;
  phone_number_valid = false;
  recapcha = '';

  constructor(private authenticationService: AuthenticationService, private router: Router, route: ActivatedRoute, private http: HttpClient) {
    this.confirmation_code = '';
    if (route.snapshot.params.activation) {
      this.confirmation = true;
    } else {
      this.model = {
        email: '',
        password: '',
        confirm_password: '',
        user_name: '',
        referral: '',
        phone_number: '',
        phone_country: '',
        terms_agreement: 0,
        is_human: false
      };
      if (route.snapshot.params.referral) {
        this.model.referral = route.snapshot.params.referral;
      }
      this.loading = false;
      this.error = '';
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.http.get('https://ipinfo.io').subscribe((result: any) => {
      if (result.country && !this.confirmation) {
        this.setCountry(result.country);
      }
    });
  }

  setCountry(countryCode) {
    this.phone_number.setCountry(countryCode.toString());
  }

  getCountryData() {
    return this.phone_number.getCountryData();
  }

  validators() {
    this.phone_number_valid = this.phone_number.isValidNumber();
  }


  register() {

    this.loading = true;
    if (this.model.is_human) {
      this.model.phone_country = this.getCountryData().dialCode;
      this.authenticationService.register(this.model)
        .subscribe((result: any) => {
          if (!result) {
            console.log('app error');
            this.loading = false;
          }
          if (result.status === true) {
            this.confirmation = true;
            this.loading = false;
            this.error = '';
          } else {
            let error_str = '';
            result.errors.forEach(function (error) {
              error_str += '<p>' + error + '</p>';
            });
            this.error = error_str;
            this.loading = false;
          }
        });
      this.recapcha = '';
    } else {
      this.error = 'You must be at least a human.';
      this.loading = false;
    }

  }

  checkUserName() {
    if (this.model.user_name.length > 3) {
      let postBody = {
        user_name: this.model.user_name
      };
      this.http.post('/auth/register/check-name', postBody).subscribe(result => {
        let is_taken = (<any>result).is_taken;
        if (is_taken === true) {
          this.username_taken = true;
        } else {
          this.username_taken = false;
        }
      });
    } else {
      this.username_taken = false;
    }
  }

  checkRefferalName() {
    if (this.model.referral.length > 3) {
      let postBody = {
        user_name: this.model.referral
      };
      this.http.post('/auth/register/check-name', postBody).subscribe(result => {
        let is_taken = (<any>result).is_taken;
        if (is_taken === true) {
          this.refferal_exist = true;
        } else {
          this.refferal_exist = false;
        }
      });
    } else {
      this.refferal_exist = false;
    }
  }

  confirm_email() {
    this.loading = true;
    this.authenticationService.activate_email(this.model.email, this.confirmation_code)
      .subscribe((result: any) => {
        this.error = '';
        if (!result) {
          console.log('app error');
          this.loading = false;
        }
        if (result.status === true) {
          this.router.navigate(['/']);
        } else {
          let error_str = '';
          result.errors.forEach(function (error) {
            error_str += '<p>' + error + '</p>';
          });
          this.error = error_str;
          this.loading = false;
        }
      });
  }

  resolved(captchaResponse: string) {
    this.model.is_human = true;
  }
}

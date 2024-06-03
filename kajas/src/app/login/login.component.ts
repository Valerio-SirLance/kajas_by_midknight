import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;
  showModal = false;
  modalMessage = '';
  resizeSubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', {
        validators: [
          Validators.required,
          Validators.email
        ]
      }],
      password: ['', {
        validators: [
          Validators.required,
          Validators.minLength(6)
        ]
      }]
    });
  }

  ngOnInit(): void {
    this.setInitialStyles();
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => this.applyBackground());
  }

  ngOnDestroy(): void {
    this.revertStyles();
    this.resizeSubscription.unsubscribe();
  }

  private setInitialStyles(): void {
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(
      document.body,
      'background',
      'url("../../assets/login_bg.png") center/cover no-repeat'
    );

    this.renderer.setStyle(document.documentElement, 'height', '100%');
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.applyBackground();
  }

  private revertStyles(): void {
    this.renderer.removeStyle(document.body, 'height');
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'display');
    this.renderer.removeStyle(document.body, 'justify-content');
    this.renderer.removeStyle(document.body, 'align-items');
    this.renderer.removeStyle(document.body, 'background');

    this.renderer.removeStyle(document.documentElement, 'height');
    this.renderer.removeStyle(document.documentElement, 'overflow');
  }

  private applyBackground(): void {
    const backgroundUrl = window.innerWidth <= 425 ? '../../assets/login_mbg.png' : '../../assets/login_bg.png';
    this.renderer.setStyle(document.body, 'background', `url("${backgroundUrl}") center/cover no-repeat`);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:4000/api/login', this.loginForm.value)
        .subscribe(
          (response: any) => {
            this.modalMessage = 'Login Success! Welcome to Kajas!';
            this.showModal = true;
            this.sessionStorage.set('id', response.user.user_id);
            this.sessionStorage.set('username', response.user.username);
            this.sessionStorage.set('email', response.user.email);

            setTimeout(() => {
              this.router.navigateByUrl('/profile');
            }, 1000);
          },
          (error: any) => {
            this.modalMessage =
              error.error.message || 'An error occurred during login';
            this.showModal = true;
          }
        );
    } else {
      this.modalMessage = 'Please fill out the form accurately first.';
      this.showModal = true;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
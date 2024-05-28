import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Apply styles to html and body when the component is initialized
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');
    
    this.renderer.setStyle(document.documentElement, 'height', '100%');
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.applyBackground();
    window.addEventListener('resize', () => {
      this.applyBackground();
    });
  }

  ngOnDestroy(): void {
    // Revert styles when the component is destroyed
    this.renderer.removeStyle(document.body, 'height');
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'display');
    this.renderer.removeStyle(document.body, 'justify-content');
    this.renderer.removeStyle(document.body, 'align-items');
    this.renderer.removeStyle(document.body, 'background');
    
    this.renderer.removeStyle(document.documentElement, 'height');
    this.renderer.removeStyle(document.documentElement, 'overflow');
    window.removeEventListener('resize', () => {});
  }

  applyBackground(): void {
    if (window.innerWidth <= 425) {
      // For mobile devices
      this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_mbg.png") center/cover no-repeat');
    } else {
      // For desktop
      this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');
    }
  }

  get f() { return this.forgotPasswordForm.controls; }

  async onSubmit(): Promise<void> {
    const url = "http://localhost:4000";
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    try {
      const response = await axios.post(`${url}/send/resetLink`, {
        email: this.forgotPasswordForm.value.email
      });

      if (response.status === 200) {
        console.log(response.data);
        alert('Password reset email sent. Please check your inbox.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      alert('Email does not Exist')
      console.error('Error sending password reset email:', error);
      this.errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
    }
  }

  onCancel() {
    // Handle cancel button click
    this.router.navigate(['/login']);
  }
}

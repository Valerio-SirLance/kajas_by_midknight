import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.component.html',
  styleUrls: ['./setup-profile.component.css']
})
export class SetupProfileComponent implements OnInit {
  profileForm: FormGroup;
  countries: any[] = [];
  cities: any[] = [];
  selectedCountryName = '';

  constructor(private fb: FormBuilder, private locationService: LocationService, 
    private sessionStorage: SessionStorageService, private router: Router) {

    this.profileForm = this.fb.group({
      id: this.sessionStorage.get('id'),
      profile: [''],
      bio: [''],
      firstName: this.sessionStorage.get('first_name'),
      lastName: this.sessionStorage.get('last_name'),
      middleName: this.sessionStorage.get('middle_name'),
      email: this.sessionStorage.get('email'),
      country: ['', {
        validators: [
          Validators.required
        ]
      }],
      city: ['', {
        validators: [
          Validators.required
        ]
      }],
      linkedIn: [''],
      facebook: [''],
      instagram: [''],
      website: [''],
      kajas_link: this.sessionStorage.get('username')
    });
  }

  ngOnInit(): void {
    this.locationService.getCountries().subscribe(data => {
      this.countries = data;
      this.countries.sort((a, b) => a.name.localeCompare(b.name)); 
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.getElementById('profile-pic-placeholder') as HTMLImageElement;
        imgElement.src = e.target.result;
        this.profileForm.patchValue({ profile: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onCountryChange(event: Event): void {
    const countryCode = (event.target as HTMLSelectElement).value;
    this.selectedCountryName = this.countries.find(country => country.id === countryCode).name;
    this.profileForm.patchValue({ country: this.selectedCountryName });

    this.locationService.getCities(countryCode).subscribe(data => {
      this.cities = data.filter(city => city['country code'] === countryCode);
      this.cities.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  async onSubmit(): Promise<void> {
    const url = "http://localhost:4000/api/setProfile";
    const formData = new FormData();
    Object.keys(this.profileForm.controls).forEach(key => {
      formData.append(key, this.profileForm.get(key).value);
    });

    try {
      const response = await axios.post(url, formData);
      this.router.navigateByUrl('/profile');
    } catch (error) {
      console.error('Error submitting the profile data:', error);
    }
  }
}

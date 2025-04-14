// Guilherme Cassiano, Shane Petree
import { Component, OnInit } from '@angular/core';
import { CommonModule, FormatWidth } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, RouterLink, NavBarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral | null = null;
  zoom = 17;
  markers: { lat: number; lng: number; title: string }[] = [];
  mapOptions: google.maps.MapOptions = {};
  role: string | null = null;
  user: any = null;
  constructor(private router: Router) { }

  ngOnInit() {
    this.waitForGoogleMaps().then(() => this.initMap());
    this.checkLoginStatus();
  }

  async waitForGoogleMaps(): Promise<void> {
    return new Promise(resolve => {
      const checkGoogleMaps = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(checkGoogleMaps);
          resolve();
        }
      }, 100);
    });
  }

  initMap() {
    if (typeof google === 'undefined' || !google.maps) {
      console.error("Google Maps API is still not available!");
      return;
    }

    const restrictedBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(39.537064704469685, -119.81803893571075),
      new google.maps.LatLng(39.55024426280125, -119.81330216925673)
    );

    const mapStyles: google.maps.MapTypeStyle[] = [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ];

    this.mapOptions = {
      mapTypeId: 'satellite',
      minZoom: 15,
      maxZoom: 20,
      restriction: {
        latLngBounds: restrictedBounds,
        strictBounds: false
      },
      styles: mapStyles
    };

    this.center = { lat: 39.54200731395531, lng: -119.81499098680625 };

    fetch('http://localhost:52363/api/buildings')
      .then(response => response.json())
      .then(data => {
        this.markers = data.map(({ buildingCode, latitude, longitude, itemCount, claimedCount }: any) => ({
          lat: latitude,
          lng: longitude,
          title: `Building ${buildingCode}\nLost Items: ${itemCount}\nClaimed Items: ${claimedCount}`
        }));
        console.log('Markers:', this.markers);
      })
      .catch(error => console.error('Error fetching building data:', error));
  }

  onMarkerClick(markerTitle: string) {
    const buildingName = markerTitle.split("\n")[0].replace("Building ", "").trim(); 
    this.router.navigate(['/lost-and-found'], { queryParams: { building: buildingName } });
  }

  onDropdownChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTitle = selectElement.value;
  
    if (selectedTitle) {
      this.onMarkerClick(selectedTitle);
    }
  }  
  
  checkLoginStatus() {
    this.role = localStorage.getItem('role');  
    const userData = localStorage.getItem('user_id');
    this.user = userData ? JSON.parse(userData) : null;
  }
}

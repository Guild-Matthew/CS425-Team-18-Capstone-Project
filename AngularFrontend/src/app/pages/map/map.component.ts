import { Component, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
declare const google: any;
//import { google-GoogleMapsModule } from '@types';

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Check if script is already added
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
      return;
    }

    // Create the script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps failed to load'));

    document.head.appendChild(script);
  });
}

@Component({
  selector: 'app-map',
  //standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit{
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  ngAfterViewInit() {
    const apiKey = 'AIzaSyDpJ6Oa8'; // Replace with your actual key
    loadGoogleMaps(apiKey)
      .then(() => {
        if (typeof google !== 'undefined' && google.maps) {
          new google.maps.Map(this.mapContainer.nativeElement, {
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
            zoom: 12
          });
        } else {
          console.error('Google Maps API did not load correctly.');
        }
      })
      .catch(console.error);
  }
}

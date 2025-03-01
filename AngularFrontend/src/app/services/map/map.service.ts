import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getBuildings(): Observable<any> {
    const url = 'url';
    return this.http.get<any>(url);
  }
  initMap():
}

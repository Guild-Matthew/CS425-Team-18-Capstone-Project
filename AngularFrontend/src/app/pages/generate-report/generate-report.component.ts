import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-generate-report',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  filterType: string = 'all';
  authToken: string | null = null;
  building: string = '';
  userId: string | null = null;
  role: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    this.authToken = localStorage.getItem('authtoken');

    if (!this.userId || !this.authToken || !this.role) {
      console.error("Missing authentication data in localStorage.");
      return;
    }

    const url = `${flask_URL}/ItemOperationLogs?filterType=${this.filterType}&user_id=${this.userId}&role=${this.role}&token=${this.authToken}`;
    console.log("Fetching logs from:", url);

    this.http.get<any[]>(url, { withCredentials: true }).subscribe({
      next: data => {
        console.log("Logs received from server:", data);
        this.logs = data || [];
        this.filterLogs();
      },
      error: error => {
        console.error("Error fetching logs:", error);
      }
    });
  }

  filterLogs(): void {
    console.log("Filtering logs with filterType:", this.filterType);
    if (this.filterType.toUpperCase() === 'ALL') {
      this.filteredLogs = this.logs;
    } else {
      this.filteredLogs = this.logs.filter(log =>
        log.actiontype?.toUpperCase() === this.filterType.toUpperCase()
      );
    }
    console.log("Filtered logs:", this.filteredLogs);
  }
}

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
  selectedDate: string = '';  // Format: YYYY-MM-DD
  logType: string = 'item';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.userId = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    this.authToken = localStorage.getItem('authtoken');

    if (!this.userId || !this.authToken || !this.role) {
      console.error("Missing authentication data.");
      return;
    }

    const dateParam = this.selectedDate ? `&date=${this.selectedDate}` : '';
    const baseURL = this.logType === 'account' ? '/AccountLogs' : '/ItemOperationLogs';
    const url = `${flask_URL}${baseURL}?filterType=${this.filterType}&user_id=${this.userId}&role=${this.role}&token=${this.authToken}${dateParam}`;

    console.log("Fetching logs from:", url);

    this.http.get<any[]>(url, { withCredentials: true }).subscribe({
      next: data => {
        console.log("Logs received:", data);
        this.logs = data || [];
        this.filterLogs();
      },
      error: error => {
        console.error("Error fetching logs:", error);
      }
    });
  }

  filterLogs(): void {
    console.log("Filtering logs. Type:", this.logType, "Filter:", this.filterType);

    if (this.filterType === 'all') {
      this.filteredLogs = this.logs;
      return;
    }

    this.filteredLogs = this.logs.filter(log =>
      log.actiontype?.toUpperCase() === this.filterType.toUpperCase()
    );
  }

  onDateChange(): void {
    console.log("Selected date:", this.selectedDate);
    this.loadLogs(); 
  }

  onLogTypeChange(): void {
    this.loadLogs();
  }

  downloadCSV(): void {
    const isItemLog = this.logType === 'item';
    const logsToExport = this.filteredLogs;

    const headers = isItemLog
      ? ['Action', 'Type', 'Location', 'Description', 'Date Found', 'Performed By', 'Performed On', 'Building']
      : ['Action', 'NetID', 'Role', 'Date Performed'];

    const rows = logsToExport.map(log => {
      return isItemLog
        ? [
          log.actiontype,
          log.itemtype,
          log.locationfound,
          log.description,
          log.datefound,
          log.performedby,
          log.dateperformed,
          log.lflocation
        ]
        : [
          log.actiontype,
          log.email,
          log.role,
          log.dateperformed
        ];
    });

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(field => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = isItemLog ? 'item_logs.csv' : 'account_logs.csv';
    a.click();

    URL.revokeObjectURL(url);
  }

}


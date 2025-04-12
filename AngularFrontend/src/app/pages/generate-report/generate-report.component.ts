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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>(`${flask_URL}/ItemOperationLogs?filterType=${this.filterType}`).subscribe(data => {
      this.logs = data;
      this.filterLogs();
    });
  }

  filterLogs(): void {
    if (this.filterType === 'all') {
      this.filteredLogs = this.logs;
    } else {
      this.filteredLogs = this.logs.filter(log => log.actiontype === this.filterType);
    }
  }
}

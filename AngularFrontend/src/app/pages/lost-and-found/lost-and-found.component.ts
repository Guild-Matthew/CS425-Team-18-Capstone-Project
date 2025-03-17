//Mary Cottier, Shane Petree, Guilherme Cassiano
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-lost-and-found',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],  // Shane Petree
  templateUrl: './lost-and-found.component.html',
  styleUrls: ['./lost-and-found.component.css']
})
export class LostAndFoundComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  building: string = '';
  clothingSubTypes: string[] = [];
  electronicsSubTypes: string[] = [];
  items: any[] = [];
  filteredItems: any[] = [];
  categories: { [key: string]: string[] } = {
    clothing: ['Shoes', 'Hoodies', 'Shirts', 'Pants', 'Hats'],
    electronics: ['Phones', 'Computers', 'Headphones', 'Tablets']
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.building = params['building'] || 'Unknown';
      this.fetchItems();
    });
  }

  fetchItems(): void {
    if (!this.building) {
      console.error("Building name is missing");
      return;
    }

    const url = `${flask_URL}/L&F?building=${this.building}&filterType=${this.filterType}&sort=${this.sortOrder}`;

    console.log('Fetching from URL:', url);

    this.http.get<any[]>(url).subscribe(
      (data) => {  
        this.items = data.map(item => ({
          type: item[0],
          location: item[1],
          description: item[2],
          dateFound: item[3],
          imageUrl: item[4]  
        }));
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter(item =>
      this.filterType === 'all' || item.type.toLowerCase() === this.filterType
    );

    this.filteredItems.sort((a, b) => this.sortOrder === 'newest'
      ? new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime()
      : new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime()
    );
  }

  onSortChange(event: any): void {
    this.sortOrder = event.target.value;
    this.applyFilters();
  }

  onFilterChange(event: any): void {
    this.filterType = event.target.value;
    this.applyFilters();
  }

  toggleImage(item: any): void {
    item.imageVisible = !item.imageVisible;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;  
  }
}

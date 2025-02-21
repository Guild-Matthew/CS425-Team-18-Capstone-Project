import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lost-and-found',
  templateUrl: './lost-and-found.component.html',
  styleUrls: ['./lost-and-found.component.css']
})
export class LostAndFoundComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  building: string = 'Building A';
  clothingSubTypes: string[] = [];
  electronicsSubTypes: string[] = [];

  items: any[] = [
    { type: 'Clothing', location: 'Room 101', dateFound: '2024-02-15', description: 'A red jacket', imageUrl: 'assets/images/jacket.jpg', imageVisible: false, subType: 'Hoodies' },
    { type: 'Electronics', location: 'Hallway', dateFound: '2024-02-10', description: 'A smartphone', imageUrl: 'assets/images/phone.jpg', imageVisible: false, subType: 'Phones' }
  ];

  categories: { [key: string]: string[] } = {
    clothing: ['Shoes', 'Hoodies', 'Shirts', 'Pants', 'Hats'],
    electronics: ['Phones', 'Computers', 'Headphones', 'Tablets']
  };

  constructor() {}

  ngOnInit(): void {
    this.sortItems();
  }

  onSortChange(event: any): void {
    this.sortOrder = event.target.value;
    this.sortItems();
  }

  onFilterChange(event: any): void {
    this.filterType = event.target.value;
    console.log('Filter Type changed:', this.filterType); // Debugging
    this.filterItems();
  }

  onSubtypeChange(event: any, category: string): void {
    const subType = event.target.value;
    let selectedSubTypes = category === 'clothing' ? this.clothingSubTypes : this.electronicsSubTypes;

    if (event.target.checked) {
      selectedSubTypes.push(subType);
    } else {
      selectedSubTypes = selectedSubTypes.filter(item => item !== subType);
    }

    if (category === 'clothing') {
      this.clothingSubTypes = selectedSubTypes;
    } else if (category === 'electronics') {
      this.electronicsSubTypes = selectedSubTypes;
    }

    this.filterItems();
  }

  sortItems(): void {
    this.items.sort((a, b) => this.sortOrder === 'newest'
      ? new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime()
      : new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime());
  }

  filterItems(): void {
    let filteredItems = this.items.filter(item =>
      (this.filterType === 'all' || item.type.toLowerCase() === this.filterType) &&
      (this.filterType !== 'clothing' || this.clothingSubTypes.length === 0 || this.clothingSubTypes.includes(item.subType)) &&
      (this.filterType !== 'electronics' || this.electronicsSubTypes.length === 0 || this.electronicsSubTypes.includes(item.subType))
    );

    this.items = filteredItems;
    this.sortItems();
  }

  toggleImage(item: any): void {
    item.imageVisible = !item.imageVisible;
  }
}

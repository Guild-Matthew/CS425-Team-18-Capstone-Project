import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'add-floor',
  standalone: true,
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class AddFloorComponent implements OnInit {
  buildings: string[] = ['Building A', 'Building B', 'Building C'];
  selectedBuilding: string = '';
  floors: string[] = [];
  newFloorNumber: number | null = null;

  ngOnInit(): void {
    this.selectedBuilding = this.buildings[0]; // Default selection
    this.fetchItems();
  }

  fetchItems(): void {
    // Simulate getting floors from a dummy "backend"
    if (this.selectedBuilding === 'Building A') {
      this.floors = ['1', '2'];
    } else if (this.selectedBuilding === 'Building B') {
      this.floors = ['G', '1'];
    } else {
      this.floors = [];
    }
  }

  addFloor(): void {
    if (this.newFloorNumber !== null) {
      const floorStr = this.newFloorNumber.toString();
      if (!this.floors.includes(floorStr)) {
        this.floors.push(floorStr);
      }
      this.newFloorNumber = null;
    }
  }

  removeFloor(floor: string): void {
    this.floors = this.floors.filter(f => f !== floor);
  }
}

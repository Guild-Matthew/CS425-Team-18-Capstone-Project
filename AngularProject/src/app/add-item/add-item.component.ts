import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
  })
export class AddItemComponent {
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior.

    const form = event.target as HTMLFormElement;

    const itemName = (form.elements.namedItem('item_name') as HTMLInputElement).value;
    const itemDescription = (form.elements.namedItem('item_description') as HTMLInputElement).value;
    const dateLost = (form.elements.namedItem('date_lost') as HTMLInputElement).value;
    const buildingCode = (form.elements.namedItem('building_code') as HTMLInputElement).value;

    const item = {
      item_name: itemName,
      item_description: itemDescription,
      date_lost: dateLost,
      building_code: buildingCode
    };

    console.log('Item Submitted:', item);
    // send 'item' to your backend API
  }
}

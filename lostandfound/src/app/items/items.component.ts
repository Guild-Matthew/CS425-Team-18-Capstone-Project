
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
 selector: 'app-items',
 templateUrl: './items.component.html',
 styleUrls: ['./items.component.css'],
 standalone: true,
 imports: [FormsModule]
})
export class ItemsComponent {
 item: any = {
   worker: '',
   location: '',
   dateFound: '',
   locationFound: '',
   itemType: '',
   description: '',
   imagePhoto: null
 };


 onSubmit(form?: NgForm) {
   if (form && form.valid) {
     console.log('Form Submitted:', this.item);
     // Logic to send data to a backend API can be implemented here
     alert('Item successfully added!');
     form.resetForm();
   }
 }


 onFileSelected(event: any) {
   const file = event.target.files[0];
   if (file) {
     this.item.imagePhoto = file;
     console.log('File selected:', file.name);
   }
 }


 toggleClothingFields() {
   console.log('Item type changed to:', this.item.itemType);
   // Additional logic for specific item types can be added here
 }
}




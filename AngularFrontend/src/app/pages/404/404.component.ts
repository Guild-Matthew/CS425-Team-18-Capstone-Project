import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './404.component.html',
  styleUrl: './404.component.css'
})
export class _404Component {

}

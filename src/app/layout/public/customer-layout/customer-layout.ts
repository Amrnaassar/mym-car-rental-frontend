import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-customer-layout',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout {

}

import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AboutUs } from './features/about-us/about-us';
import { Faq } from './features/faq/faq';
import { Contact } from './features/contact/contact';
import { Services } from './features/company-services/services';
import { Cars } from './features/cars/cars';
import { CarDetails } from './features/cars/car-details/car-details';
import { Booking } from './features/booking/booking';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about-us', component: AboutUs },
    { path: 'cars', component: Cars },
    { path: 'cars/:id', component: CarDetails },
    { path: 'booking', component: Booking },
    { path: 'faq', component: Faq },
    { path: 'contact', component: Contact },
    { path: 'services', component: Services },
    { path: '**', component: NotFound },

];

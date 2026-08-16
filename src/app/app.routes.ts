import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AboutUs } from './features/about-us/about-us';
import { Faq } from './features/faq/faq';
import { Contact } from './features/contact/contact';
import { Services } from './features/services/services';

export const routes: Routes = [
    { path: "", redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'about-us', component: AboutUs },
    { path: 'faq', component: Faq },
    { path: 'contact', component: Contact },
    { path: 'services', component: Services },

    // { path: '**', component: NotFoundComponent },

];

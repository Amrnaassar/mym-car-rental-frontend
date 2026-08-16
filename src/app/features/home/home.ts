import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { FeaturedCars } from "./featured-cars/featured-cars";
import { WhyChooseUs } from "./why-choose-us/why-choose-us";
import { PopularCategories } from "./popular-categories/popular-categories";

@Component({
  selector: 'app-home',
  imports: [Hero, FeaturedCars, WhyChooseUs, PopularCategories],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ListComponent } from '../components/list.component';

// Services
import { CitiesService } from '../services/cities.service';
import { RenderDateService } from '../services/renderDate.service';

// Types
import { Cities } from '../types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ListComponent],
  template: `
    <main>
      <p class="bg-black text-white font-mono text-center py-2 text-sm">
        Rendered at {{ renderTime }} by Angular
      </p>
      <p
        class="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-neutral-100 font-mono mx-auto"
      >
        {{ license }}
      </p>
      <list-component [cities]="cities" />
      <p
        class="max-w-3xl rounded-3xl mt-6 px-8 py-6 bg-yellow-200/50 shadow-yellow-200/10 shadow-xl text-xs border border-yellow-200 font-mono mx-auto"
      >
        All the ciredit for the provided data goes to {{ credit }}
      </p>
      <router-outlet></router-outlet>
    </main>
  `,
  providers: [CitiesService, RenderDateService],
})
export class AppComponent {
  CitiesService = inject(CitiesService);
  RenderDateService = inject(RenderDateService);

  // items
  renderTime = '';
  cities: Cities = [];
  credit = '';
  license = '';

  constructor(
    private citiesService: CitiesService,
    private renderDateService: RenderDateService
  ) {}

  ngOnInit() {
    this.citiesService.getData().subscribe(({ cities, credit, license }) => {
      this.cities = cities;
      this.credit = credit;
      this.license = license;
    });

    const { renderedAt } = this.renderDateService.get();
    this.renderTime = renderedAt;
  }
}

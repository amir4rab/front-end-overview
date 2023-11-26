import { Component, Input, PLATFORM_ID, inject } from '@angular/core';

// Types
import { Cities, City } from '../types';

@Component({
  selector: 'list-component',
  template: `
    <div class="max-w-3xl mx-auto my-12">
      <form
        class="bg-neutral-900 text-white px-6 py-4 rounded-3xl grid gap-2 shadow-neutral-900/20 shadow-xl"
      >
        <div class="flex justify-between">
          <label class="text-2xl font-semibold" for="search"> Search </label>
          @if( this.hiddenItems.size !== 0 ){
          <button
            (click)="clearHiddenItems()"
            class="text-sm underline hover:text-green-200 transition-colors duration-200"
          >
            Clear {{ this.hiddenItems.size }} hidden items
          </button>
          }
        </div>
        <input
          (keyup)="onParam($event)"
          class="rounded-xl px-4 py-2 bg-neutral-700 text-white"
        />
      </form>
      <ol class="grid gap-2 my-4">
        @for(city of filteredList; track city.name + city.population){
        <li
          class="grid gap-2 px-6 py-4 rounded-3xl bg-neutral-100 shadow-xl shadow-transparent hover:shadow-neutral-900/10 hover:scale-[101%] transition-[box-shadow,transform] duration-150"
        >
          <div class="flex justify-between">
            <p class="text-lg font-semibold">{{ city.name }}</p>
            <button
              (click)="hideCity(city)"
              class="px-4 py-1 rounded-3xl bg-neutral-200 text-sm capitalize hover:bg-neutral-300 transition-color duration-150"
            >
              hide
            </button>
          </div>
          <p class="text-sm opacity-75 font-mono uppercase">
            population: {{ city.population.toLocaleString('en-US') }}
          </p>
        </li>
        }
      </ol>
    </div>
  `,
  standalone: true,
})
export class ListComponent {
  @Input() cities: Cities = [];
  filteredList: Cities = [];
  hiddenItems: Map<string, boolean> = new Map();
  query = '';
  platformId = inject(PLATFORM_ID);

  constructor() {}

  ngOnInit() {
    this.filteredList = this.cities;
  }

  filterItems = () => {
    this.filteredList = this.cities.filter(({ name, population }) => {
      if (this.hiddenItems.get(name + population)) return false;
      return this.query === '' ? true : name.toLowerCase().includes(this.query);
    });
  };

  clearHiddenItems = () => {
    this.hiddenItems.clear();
    this.filterItems();
  };

  onParam = (ev: Event) => {
    this.query = (ev.target as HTMLInputElement).value.toLowerCase();
    this.filterItems();
  };

  hideCity = ({ name, population }: City) => {
    this.hiddenItems.set(name + population, true);
    this.filterItems();
  };

  getIsHidden = ({ name, population }: City) => {
    this.hiddenItems.get(name + population);
    this.filterItems();
  };
}

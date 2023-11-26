import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Cities } from '../types';

type FetchedData = {
  license: string;
  credit: string;
  cities: Cities;
};

@Injectable()
export class CitiesService {
  constructor(private http: HttpClient) {}

  getData(): Observable<FetchedData> {
    const url = `http://localhost:3090`;
    return this.http.get<FetchedData>(url);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config/constants';
import { Fresher } from '../models/fresher.model';

@Injectable({ providedIn: 'root' })
export class FresherService {
  private http = inject(HttpClient);
  private url = `${API_URL}/freshers`;

  getAll() {
    return this.http.get<Fresher[]>(this.url);
  }

  create(fresher: Fresher) {
    return this.http.post<Fresher>(this.url, fresher);
  }

  update(id: number, fresher: Fresher) {
    return this.http.put<Fresher>(`${this.url}/${id}`, fresher);
  }

  delete(id: number) {
    // backend returns a plain text message, not JSON
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
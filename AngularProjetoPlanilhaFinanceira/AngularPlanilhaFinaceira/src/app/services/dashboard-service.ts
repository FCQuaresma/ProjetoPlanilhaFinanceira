import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { DashboardDto } from '../Models/DashboardDto';
import { firstValueFrom } from 'rxjs';
import { CategoryTotalDto } from '../Models/CategoryTotalDto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);
  url = environment;

  async obterResumo(year: number, month: number): Promise<DashboardDto> {
    const query = new URLSearchParams();

    query.append('year', year.toString());
    query.append('month', month.toString());

    const url = `${this.url.apiUrl}/dashboard/summary?${query.toString()}`;

    return await firstValueFrom(this.http.get<DashboardDto>(url));
  }

  async obterTotaisPorCategoria(year: number, month: number): Promise<CategoryTotalDto[]> {
    const query = new URLSearchParams();

    query.append('year', year.toString());
    query.append('month', month.toString());

    const url = `${this.url.apiUrl}/dashboard/by-category?${query.toString()}`;

    return await firstValueFrom(this.http.get<CategoryTotalDto[]>(url));
  }
}

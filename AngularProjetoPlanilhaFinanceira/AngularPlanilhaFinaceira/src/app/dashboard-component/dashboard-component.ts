import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardDto } from '../Models/DashboardDto';
import { Category } from '../Models/Category';
import { CategoryTotalDto } from '../Models/CategoryTotalDto';
import { DashboardService } from '../services/dashboard-service';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  dashboardService = inject(DashboardService);
  router = inject(Router);

  filtroAno: number | null = null;
  filtroMes: number | null = null;

  resumo: DashboardDto | null = null;
  categorias: CategoryTotalDto[] = [];

  chartResumo?: Chart;
  chartCategorias?: Chart;

  meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

   voltarParaHome(){
    this.router.navigate([''])
  }

  async aplicarFiltros() {
    if (!this.filtroAno || !this.filtroMes) {
      alert('Selecione ano e Mês');
      return;
    }

    await this.carregarResumo();
    await this.carregarCategoria();
  }

  limparFiltros() {
    this.filtroAno = null;
    this.filtroMes = null;

    this.resumo = null;
    this.categorias = [];

    this.chartResumo?.destroy();
    this.chartCategorias?.destroy();
  }

  private async carregarResumo() {
    this.resumo = await this.dashboardService.obterResumo(this.filtroAno!, this.filtroMes!);

    if (!this.resumo) return;

    setTimeout(() => this.renderizarGraficoResumo());
  }

  private async carregarCategoria() {
    this.categorias = await this.dashboardService.obterTotaisPorCategoria(
      this.filtroAno!,
      this.filtroMes!,
    );

    if (!this.categorias.length) return;

    setTimeout(() => this.renderizarGraficoCategorias());
  }

  private renderizarGraficoCategorias() {
    this.chartCategorias?.destroy();
    const canvas = document.getElementById('graficoCategorias') as HTMLCanvasElement;
    if (!canvas) return;
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: this.categorias.map (c=> c.categoryName),
        datasets: [
          {
            data: this.categorias.map(c => c.total)
          },
        ],
      },
      options: {
        responsive: true,
      },
    };
    this.chartCategorias = new Chart(canvas, config);
  }

  private renderizarGraficoResumo() {
    this.chartResumo?.destroy();
    const canvas = document.getElementById('graficoResumo') as HTMLCanvasElement;
    if (!canvas) return;
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Receitas', 'Despesas', 'Saldo'],
        datasets: [
          {
            data: [this.resumo!.receitas, this.resumo!.despesas, this.resumo!.saldo],
            backgroundColor: ['#198754', '#dc3545', '#0d6efd'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    };
    this.chartResumo = new Chart(canvas, config);
  }



}

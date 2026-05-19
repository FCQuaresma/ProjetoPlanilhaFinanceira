import { Component, inject, signal } from '@angular/core';
import { FinanceiroService } from '../services/financeiro-service';
import { Transaction } from '../Models/Transaction';
import { CATEGORIA_MAP } from '../categoria.map';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { abrirCriarEditarModal } from '../editar-criar-modal-component/editar-criar-modal-component';
import { RelatorioService } from '../services/relatorio-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  financasService = inject(FinanceiroService);
  relatorioService = inject(RelatorioService);
  financas = signal<Transaction[]>([]);
  categories = CATEGORIA_MAP;
  dialog = inject(MatDialog);
  router = inject(Router);

  filtroTipo: 'R' | 'D' | '' = '';
  filtroAno: number | null = null;
  filtroMes: number | null = null;

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

  constructor() {
    this.carregarFinancas();
  }

  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async carregarFinancas() {
    try {
      const params = this.montarQueryParams();
      const financas = await this.financasService.buscarFinancas(params);

      this.financas.set(financas);
    } catch (err) {
      console.log(err);
    }
  }

  private montarQueryParams() {
    const params: any = {};

    if (this.filtroTipo) params.type = this.filtroTipo;
    if (this.filtroAno) params.year = this.filtroAno;
    if (this.filtroMes) params.month = this.filtroMes;

    return params;
  }

  getCategoryName(id: number): string {
    return this.categories[id]?.name ?? 'Desconhecida';
  }

  async aplicarFiltros() {
    debugger;
    const params = this.montarQueryParams();
    const lista = await this.financasService.buscarFinancas(params);

    this.financas.set(lista);
  }

  async limparFiltros() {
    this.filtroTipo = '';
    this.filtroAno = null;
    this.filtroMes = 0;

    const lista = await this.financasService.buscarFinancas({});
    this.financas.set(lista);
  }

  async editar(financa: Transaction) {
    const novaFinanca = await abrirCriarEditarModal(this.dialog, {
      modo: 'editar',
      titulo: 'Editar Finança Existente',
      financa: financa,
    });

    if (!novaFinanca) return;

    const financas = this.financas();

    const novasFinancas = financas.map((f) => (f.id == novaFinanca.id ? novaFinanca : f));

    this.financas.set(novasFinancas);
  }

  async novaFinanca() {
    const novaFinanca = await abrirCriarEditarModal(this.dialog, {
      modo: 'criar',
      titulo: 'Nova Finança',
    });

    if (!novaFinanca) return;

    const novaFinancas = [...this.financas(), novaFinanca];

    this.financas.set(novaFinancas);
  }

  async remover(financaId: number) {
    try {
      await this.financasService.removerFinanca(financaId);

      const financas = this.financas();

      const novaListafinancas = financas.filter((financa) => financa.id !== financaId);

      this.financas.set(novaListafinancas);
    } catch (err) {
      console.log(err);
    }
  }

  async exportarCsv() {
    const params = this.montarQueryParams();

    const blob = await this.relatorioService.exportarCsv(params);

    this.downloadArquivo(blob, `movimentacoes.csv`);
  }

  async exportarExcel() {
    const params = this.montarQueryParams();

    const blob = await this.relatorioService.exportarExcel(params);

    this.downloadArquivo(blob, `movimentacoes.xlsx`);
  }

  private downloadArquivo(blob: Blob, nomeArquivo: string) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement(`a`);
    a.href = url;
    a.download = nomeArquivo;
    a.click();

    window.URL.revokeObjectURL(url);
  }
}

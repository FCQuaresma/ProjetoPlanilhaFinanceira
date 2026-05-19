import type { Point, BubbleDataPoint } from 'chart.js';

export interface DashboardDto{
  saldo: number | [number, number] | Point | BubbleDataPoint | null;
  receitas: number;
  despesas: number;
  saldoAnterior: number;
  diferenca: number;
  percentualCrescimento: number;
}

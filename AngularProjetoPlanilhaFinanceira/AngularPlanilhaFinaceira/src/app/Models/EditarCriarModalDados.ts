import { Transaction } from "./Transaction";

export type EditarCriarDadosModel={
  modo: 'criar' | 'editar';
  titulo: string;
  financa?: Transaction
}

import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { EditarCriarDadosModel } from '../Models/EditarCriarModalDados';
import { first, firstValueFrom } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CATEGORIA_MAP } from '../categoria.map';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { TransactionCreateDto } from '../Models/TransactionCreateDto';
import { FinanceiroService } from '../services/financeiro-service';
import { Transaction } from '../Models/Transaction';

@Component({
  selector: 'app-editar-criar-modal-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './editar-criar-modal-component.html',
  styleUrl: './editar-criar-modal-component.css',
})
export class EditarCriarModalComponent {
  fb = inject(FormBuilder);
  data: EditarCriarDadosModel = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  financaService = inject(FinanceiroService);

  categoryList = Object.entries(CATEGORIA_MAP).map(([id, value]) => ({
    id: Number(id),
    name: value.name,
    Color: value.color,
  }));

  form = this.fb.group({
    type: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: ['', [Validators.required]],
    categoryId: [0, [Validators.required]],
    description: [''],
  });

  campoInvalido(nome: string){
    const campo = this.form.get(nome);
    return campo?.invalid && (campo.touched || campo.dirty)
  }

  constructor() {
    const dataFormatada = this.data?.financa?.date ? this.data.financa.date.substring(0, 10) : '';

    this.form.patchValue({
      type: this.data?.financa?.type,
      amount: this.data?.financa?.amount,
      date: dataFormatada,
      categoryId: this.data?.financa?.categoryId,
      description: this.data?.financa?.description,
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    debugger;

    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const financaPropriedades = this.form.value as TransactionCreateDto;

    // Garante que os valores numéricos sejam convertidos corretamente
    financaPropriedades.amount = Number(financaPropriedades.amount);
    financaPropriedades.categoryId = Number(financaPropriedades.categoryId);

    if (this.data?.modo === 'editar') {
      this.editarFinanca(this.data?.financa!.id, financaPropriedades);
    } else {
      this.criarFinanca(financaPropriedades);
    }
  }

  async editarFinanca(financaId: number, mudancas: TransactionCreateDto) {
    try {
      const atualizarFinanca = await this.financaService.atualizarFinanca(financaId, mudancas);

      this.dialogRef.close(atualizarFinanca);
    } catch (err) {
      console.log(err);
    }
  }

  async criarFinanca(financa: TransactionCreateDto) {
    try {
      debugger;
      const criacaoFinanca = await this.financaService.criarFinanca(financa);
      this.dialogRef.close(criacaoFinanca);
    } catch (err) {
      console.log(err);
    }
  }
}

export async function abrirCriarEditarModal(dialog: MatDialog, data: EditarCriarDadosModel) {
  const config = new MatDialogConfig();

  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';

  config.data = data;

  const close$ = dialog.open(EditarCriarModalComponent, config).afterClosed();

  return firstValueFrom(close$);
}

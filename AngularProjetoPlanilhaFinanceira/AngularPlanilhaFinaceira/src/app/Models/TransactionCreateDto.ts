export interface TransactionCreateDto{
  type: 'R' | 'D';
  amount: number;
  date: string;
  categoryId: number;
  description?: string;
}

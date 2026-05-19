export interface Transaction{
  id: number;
  type: 'R' | 'D';
  amount: number;
  date: string;
  categoryId: number;
  description?: string;

}

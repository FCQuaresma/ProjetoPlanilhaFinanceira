using DapperFinanceVideo.DTOs;
using DapperFinanceVideo.Models;
using DapperFinanceVideo.Repositories;

namespace DapperFinanceVideo.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ICategoryRepository _categoryRepository;

        public FinanceService(ITransactionRepository transactionRepository, ICategoryRepository categoryRepository)
        {
            _transactionRepository = transactionRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<Transaction> AddTransactionAsync(Transaction t)
        {
            if (t.Amount <= 0) throw new ArgumentException("A quantidade precisa ser superior a zero", nameof(t.Amount));
            if (t.Type != 'R' && t.Type != 'D') throw new ArgumentException("O tipo precisa ser R (Receita) ou D (Despesa)", nameof(t.Type));

            return await _transactionRepository.AddAsync(t);
        }

        public async Task DeleteTransactionAsync(int id)
        {
            await _transactionRepository.DeleteAsync(id);
        }

        public async Task<DashboardDto> GetDashboardAsync(int month, int year)
        {

            if (month < 1 || month > 9999)
                throw new ArgumentException("Mês inválido", nameof(month));
            if (year < 1 || year > 9999)
                throw new ArgumentException("Ano inválido", nameof(year));


            var all = (await _transactionRepository.GetAllAsync()).ToList();

            var atual = all.Where(t => t.Date.Month == month && t.Date.Year == year);

            int prevMonth = month == 1 ? 12 : month - 1;
            int prevYear = month == 1 ? year - 1 : year;

            IEnumerable<Transaction> anterior = Enumerable.Empty<Transaction>();

            if (prevYear >= 1)
                anterior = all.Where(t => t.Date.Month == prevMonth && t.Date.Year == prevYear);


            decimal receitas = atual.Where(t => t.Type == 'R').Sum(t => t.Amount);
            decimal despesas = atual.Where(t => t.Type == 'D').Sum(t => t.Amount);
            decimal saldo = receitas - despesas;

            decimal saldoAnterior = anterior.Any() ?
                anterior.Sum(t => t.Type == 'R' ? t.Amount : -t.Amount) : 0m;

            decimal diferenca = saldo - saldoAnterior;
            decimal percentual = saldoAnterior != 0 ?
                Math.Round((diferenca / Math.Abs(saldoAnterior)) * 100, 2) : (diferenca == 0 ? 0 : 100);

            return new DashboardDto
            {
                Receitas = receitas,
                Despesas = despesas,
                Saldo = saldo,
                SaldoAnterior = saldoAnterior,
                Diferenca = diferenca,
                PercentualCrescimento = percentual
            };

        }

        public async Task<IEnumerable<CategoryTotalDto>> GetToTalsByCategoryAsync(int? month = null, int? year = null)
        {
            var all = (await _transactionRepository.GetAllAsync()).AsEnumerable();
            var categories = (await _categoryRepository.GetAllAsync()).ToList();

            if (year.HasValue)
                all = all.Where(t => t.Date.Year == year.Value);

            if (month.HasValue)
                all = all.Where(t => t.Date.Month == month.Value);

            var grouped = all
                .GroupBy(t => t.CategoryId)
                .Select(g =>
                {
                    var category = categories.FirstOrDefault(c => c.Id == g.Key);

                    return new CategoryTotalDto
                    {
                        CategoryId = g.Key,
                        CategoryName = category?.Name ?? "Categoria Desconhecida",
                        Total = g.Sum(t => t.Amount)

                    };

                }).ToList();

            return grouped;

        }

        public async Task<Transaction?> GetTransactionByIdAsync(int id)
        {
            return await _transactionRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Transaction>> GetTransactionsAsync(int? month = null, int? year = null, char? type = null)
        {
            var all = (await _transactionRepository.GetAllAsync()).AsEnumerable();


            if (year.HasValue)
                all = all.Where(t => t.Date.Year == year.Value);

            if (month.HasValue)
                all = all.Where(t => t.Date.Month == month.Value);

            if (type.HasValue)
                all = all.Where(t => t.Type == type.Value);


            return all.OrderByDescending(t => t.Date);
        }

        public async Task UpdateTransactionAsync(Transaction t)
        {
            if (t.Amount <= 0) throw new ArgumentException("A quantidade precisa ser superior a zero", nameof(t.Amount));
            if (t.Type != 'R' && t.Type != 'D') throw new ArgumentException("O tipo precisa ser R (Receita) ou D (Despesa)", nameof(t.Type));

            await _transactionRepository.UpdateAsync(t);
        }
    }
}

using DapperFinanceVideo.DTOs;
using DapperFinanceVideo.Models;


namespace DapperFinanceVideo.Services
{
    public interface IFinanceService
    {
        Task<IEnumerable<Transaction>> GetTransactionsAsync(int? month = null, int? year = null, char? type = null);
        Task<Transaction?> GetTransactionByIdAsync(int id);
        Task<Transaction> AddTransactionAsync(Transaction t);
        Task UpdateTransactionAsync(Transaction t);
        Task DeleteTransactionAsync(int id);

        Task<DashboardDto> GetDashboardAsync(int month, int year);
        Task<IEnumerable<CategoryTotalDto>> GetToTalsByCategoryAsync(int? month = null, int? year = null);

    }
}

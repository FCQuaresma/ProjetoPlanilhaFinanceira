using DapperFinanceVideo.Models;

namespace DapperFinanceVideo.Repositories
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task<Transaction?> GetByIdAsync(int id);
        Task<Transaction> AddAsync(Transaction t);
        Task<int> UpdateAsync(Transaction t);
        Task<int> DeleteAsync(int id);

    }
}

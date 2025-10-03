import { Transaction, Category } from '../types';
import { formatCurrency } from './currencies';

export const exportToCSV = (transactions: Transaction[], categories: Category[]) => {
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Currency', 'Payment Method', 'Description'];

  const rows = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return [
      t.transactionDate,
      t.type,
      category?.name || 'Unknown',
      t.amount,
      t.currency,
      t.paymentMethod,
      t.description
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (transactions: Transaction[], categories: Category[], currency: string) => {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1f2937; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .expense { color: #ef4444; }
        .income { color: #10b981; }
        .summary { margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>Transaction Report</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Payment Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => {
            const category = categories.find(c => c.id === t.categoryId);
            return `
              <tr>
                <td>${new Date(t.transactionDate).toLocaleDateString()}</td>
                <td>${category?.name || 'Unknown'}</td>
                <td>${t.description}</td>
                <td>${t.paymentMethod}</td>
                <td class="${t.type}">${t.type === 'expense' ? '-' : '+'}${formatCurrency(t.amount, t.currency)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="summary">
        <h2>Summary</h2>
        <p>Total Income: ${formatCurrency(
          transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
          currency
        )}</p>
        <p>Total Expenses: ${formatCurrency(
          transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
          currency
        )}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
};

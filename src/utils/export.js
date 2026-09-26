// Export Data Helpers (CSV Generation & Download)

export function exportToCSV(data, filename) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(item => {
    return headers.map(header => {
      let val = item[header];
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      val = val === undefined || val === null ? '' : String(val);
      // Escape quotes
      val = val.replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

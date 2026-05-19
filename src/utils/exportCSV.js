export function exportToCSV(leads, filename) {
  const csvRows = [];
  const headers = ["Name", "Phone", "Status", "Note", "Email"];
  csvRows.push(headers.join(","));

  for (const lead of leads) {
    const values = [lead.name, lead.phone, lead.status, lead.note, lead.email];
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
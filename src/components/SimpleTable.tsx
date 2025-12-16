
export function SimpleTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="card">
      <h2>{title}</h2>

      {rows.length === 0 ? (
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.75rem' }}>
          No data available.
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  {r.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

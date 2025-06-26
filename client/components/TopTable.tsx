type TopTableProps = {
  title: string;
  data: { name: string; [key: string]: any }[];
  topN: number;
  sortBy: string;
};

export default function TopTable({ title, data, topN, sortBy }: TopTableProps) {
 const topData = [...data]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, topN);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-xs mx-2">
      <h2 className="text-base font-semibold text-gray-800 mb-3">{title}</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</th>
          </tr>
        </thead>
        <tbody>
          {topData.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="py-1.5 text-gray-700">{item.name}</td>
              <td className="text-blue-600 font-bold text-center">{item[sortBy]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";

const ArticleTable = () => {
  const articles = [
    { title: "Article 1", category: "Santé", date: "2025-06-01", status: "Pending" },
    { title: "Article 2", category: "Bien-être", date: "2025-06-02", status: "Pending" },
	{ title: "Article 3", category: "Bien-être", date: "2025-06-02", status: "Pending" },
	{ title: "Article 4", category: "Bien-être", date: "2025-06-02", status: "Pending" },
	{ title: "Article 5", category: "Bien-être", date: "2025-06-02", status: "Pending" },
	{ title: "Article 6", category: "Bien-être", date: "2025-06-02", status: "Pending" },
	{ title: "Article 7", category: "Bien-être", date: "2025-06-02", status: "Pending" },
	{ title: "Article 8", category: "Santé", date: "2025-06-01", status: "Pending" },
	{ title: "Article 9", category: "Santé", date: "2025-06-01", status: "Pending" },
	{ title: "Article 10", category: "Santé", date: "2025-06-01", status: "Pending" },
    // Add more entries as needed
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Articles à approuver</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Titre</th>
            <th className="p-2 border">Catégorie</th>
            <th className="p-2 border">Date de soumission</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{article.title}</td>
              <td className="p-2 border">{article.category}</td>
              <td className="p-2 border">{article.date}</td>
              <td className="p-2 border flex space-x-2">
                <button className="bg-green-500 text-white px-4 py-1 rounded">
                  Approuver
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded">
                  Rejeter
                </button>
				<button className="bg-yellow-500 text-white px-4 py-1 rounded">
                  Lire l'article
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;

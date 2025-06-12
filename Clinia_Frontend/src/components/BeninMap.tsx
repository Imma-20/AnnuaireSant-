
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BeninMap = () => {
  const departments = [
    { name: "Bouenza", count: null, color: "bg-green-500" },
    { name: "Brazzaville", count: 208, color: "bg-green-600" },
    { name: "Cuvette", count: null, color: "bg-green-500" },
    { name: "Cuvette-Ouest", count: null, color: "bg-green-500" },
    { name: "Kouilou", count: null, color: "bg-green-500" },
    { name: "Lékoumou", count: null, color: "bg-green-500" },
    { name: "Likouala", count: null, color: "bg-green-500" },
    { name: "Niari", count: 5, color: "bg-green-600" },
    { name: "Plateaux", count: null, color: "bg-green-500" },
    { name: "Pointe-Noire", count: 105, color: "bg-green-600" },
    { name: "Pool", count: null, color: "bg-green-500" },
    { name: "Sangha", count: null, color: "bg-green-500" },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="w-1/3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🗺️ Départements</CardTitle>
                  <a href="#" className="text-green-600 hover:text-green-700 text-sm">
                    Voir tous →
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${dept.color} mr-3`}></div>
                        <span className="text-sm text-gray-700">{dept.name}</span>
                      </div>
                      {dept.count && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {dept.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-2/3 pl-8">
            <div className="relative">
              {/* SVG Map of Congo-Brazzaville */}
              <svg viewBox="0 0 400 500" className="w-full max-w-md mx-auto">
                {/* Simplified Congo-Brazzaville map shape */}
                <path
                  d="M80 50 L180 40 L220 60 L250 80 L280 120 L300 160 L320 200 L310 250 L290 300 L270 350 L250 400 L220 430 L180 450 L140 440 L100 420 L80 380 L60 340 L50 300 L45 250 L50 200 L60 150 L70 100 Z"
                  fill="#e5e7eb"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  className="hover:fill-green-100 transition-colors cursor-pointer"
                />
                
                {/* Department divisions - simplified */}
                <circle cx="200" cy="380" r="8" fill="#22c55e" className="cursor-pointer" />
                <text x="210" y="385" fontSize="10" fill="#374151">Brazzaville</text>
                
                <circle cx="120" cy="420" r="6" fill="#22c55e" className="cursor-pointer" />
                <text x="130" y="425" fontSize="10" fill="#374151">Pointe-Noire</text>
                
                <circle cx="180" cy="300" r="4" fill="#22c55e" className="cursor-pointer" />
                <text x="190" y="305" fontSize="10" fill="#374151">Niari</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeninMap;

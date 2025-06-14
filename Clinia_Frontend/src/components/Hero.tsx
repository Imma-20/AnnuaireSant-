
import { useState } from "react";
import { Search, Plus, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onSearch: (query: string, category: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddBusiness = () => {
    navigate('/ajouter-centre');
  };


  return (
    <section className="relative min-h-[500px] bg-gradient-to-br from-green-700 via-green-600 to-green-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Annuaire de centres de santé au Bénin
        </h1>
        <p className="text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Trouvez rapidement  des établissements de santé près de chez vous.
        </p>

        {/* Search Form */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <Input
              placeholder="un centre ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-14 pl-6 pr-32 text-lg rounded-full border-0 shadow-lg"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 h-10 px-8 bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={handleAddBusiness}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full px-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une structure de santé
          </Button>
          {/* <Button 
            variant="outline" 
            className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 rounded-full px-6"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Passez une annonce
          </Button>
          <Button 
            variant="outline" 
            className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 rounded-full px-6"
          >
            <Star className="mr-2 h-4 w-4" />
            Obtenez un devis
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;

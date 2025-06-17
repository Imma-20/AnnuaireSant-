import { useState, useEffect } from "react";
import { Menu, X, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHealthcareIndex, setCurrentHealthcareIndex] = useState(0);
  const navigate = useNavigate();

  const healthcareFacilities = [
    "hôpital",
    "centre de rééducation",
    "clinique",
    "laboratoire",
    "cabinet d'imagerie",
    "cabinet dentaire",
    "ambulance et urgence",
    "pharmacie"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHealthcareIndex((prevIndex) =>
        prevIndex === healthcareFacilities.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [healthcareFacilities.length]);

  const handleAddBusiness = () => {
    navigate("/ajouter-centre");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleConnexion = () => {
    navigate("/gerer-connexion");
  };

  const handleConnexionGestion = () => {
    navigate("/gerer-connexion");
  };

 

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
              <h1 className="text-2xl font-bold text-primary">
                CLI<span className="text-green-600">NIA</span>
              </h1>
            </div>
          </div>

          {/* Barre de recherche (desktop uniquement) */}
          <div className="hidden md:flex mx-6 w-1/2">
            <div className="flex items-center w-full bg-gray-100 border border-gray-300 rounded-full px-4 py-1">
              <Search className="text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder={`${healthcareFacilities[currentHealthcareIndex]}...`}
                className="flex-1 bg-transparent outline-none text-sm text-gray-400 placeholder-gray-400"
              />
              <Button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full shadow-sm transition duration-300 ease-in-out text-sm font-semibold flex items-center">
                <Search className="w-4 h-4 mr-1" />
                Rechercher
              </Button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleConnexion}
              className="text-sm font-medium text-foreground hover:text-green-700 transition-colors"
            >
              Se connecter
            </button>
            <Button
              onClick={handleAddBusiness}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full shadow-sm transition duration-300 ease-in-out text-sm font-semibold"
            >
              Ajouter une structure de santé
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {/* Icône Se connecter */}
              <Button
                variant="ghost"
                size="icon"
                
               onClick={() => {
                  handleConnexionGestion();
                  setIsMenuOpen(false);
                }}
                
                className="self-start"
                aria-label="Se connecter"
              >
                <User className="h-5 w-5 text-foreground hover:text-green-700" />
              </Button>

              {/* Bouton Ajouter une structure */}
              <Button
                onClick={() => {
                  handleAddBusiness();
                  setIsMenuOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white w-full mt-2 px-4 py-1 rounded-full shadow-sm transition duration-300 ease-in-out text-sm font-semibold"
              >
                Ajouter une structure de santé
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

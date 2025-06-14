
import { useState } from "react";
import { Menu, X, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddBusiness = () => {
    navigate('/ajouter-centre');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3"> {/* Added spacing */}
            {/* SVG Icon */}
            {/* <svg
              className="h-8 w-auto" // Example size using Tailwind CSS
              viewBox="0 0 88 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M44 81.6C44 81.6 10.7 62.4 2.3 45.8C-6 29.1 -10.2 12.4 6.5 0C23.2 -12.4 35.7 -4.2 44 8.3C52.3 -4.2 64.8 -12.4 81.5 0C98.2 12.4 94 29.1 85.7 45.8C77.3 62.4 44 81.6 44 81.6Z" fill="#378D86" />
              <path d="M54.1 47.1H47.1V54.1C47.1 55.5 46 56.5 44.7 56.5C43.4 56.5 42.4 55.5 42.4 54.1V47.1H35.4C34 47.1 33 46.1 33 44.8C33 43.4 34 42.4 35.4 42.4H42.4V35.4C42.4 34 43.4 33 44.7 33C46 33 47.1 34 47.1 35.4V42.4H54.1C55.5 42.4 56.5 43.4 56.5 44.8C56.5 46.1 55.5 47.1 54.1 47.1Z" fill="white" />
            </svg> */}

            {/* Your Text */}
            <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
              <h1 className="text-2xl font-bold text-primary">
                CLI<span className="text-green-600">NIA</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Accueil</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Structures de santé</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">À propos</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
           
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white"  onClick={handleAddBusiness}>
               Ajouter une structure de santé
            </Button>
          </div>

          {/* Mobile menu button */}
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
              <a href="#" className="text-foreground hover:text-primary transition-colors">Accueil</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Structures de santé</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Services</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">À propos</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full mt-4"  onClick={handleAddBusiness}>
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

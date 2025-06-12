
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Congo<span className="text-green-600">Finder</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              La plateforme de référence pour découvrir les meilleures entreprises 
              de la République Démocratique du Congo.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-green-600 transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Rechercher</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Catégories</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Ajouter une entreprise</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-green-600 transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Kinshasa, Gombe<br />République Démocratique du Congo</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+243 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@congofinder.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 CongoFinder. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

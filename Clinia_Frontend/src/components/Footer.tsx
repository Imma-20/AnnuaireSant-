// src/components/Footer.jsx
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Obtenez l'année actuelle dynamiquement

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              CLI<span className="text-green-600">NIA</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              La plateforme de référence pour découvrir les meilleures entreprises de santé au **Bénin**.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/clinia" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              </a>
              <a href="https://twitter.com/clinia" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              </a>
              <a href="https://instagram.com/clinia" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              </a>
              <a href="https://linkedin.com/company/clinia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 cursor-pointer hover:text-green-600 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/" className="hover:text-green-600 transition-colors">Accueil</a></li>
              <li><a href="/search-results" className="hover:text-green-600 transition-colors">Rechercher</a></li>
              {/* Ces liens sont des placeholders pour le moment, adaptez-les à vos routes réelles */}
              <li><a href="#" className="hover:text-green-600 transition-colors">Catégories</a></li>
              <li><a href="/ajouter-centre" className="hover:text-green-600 transition-colors">Ajouter une structure</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Blog/Actualités</a></li>
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
                {/* Exemple d'adresse au Bénin. Adaptez selon l'adresse réelle de votre entreprise. */}
                <span>Cotonou, Bénin</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {/* Numéro de téléphone pour le Bénin. Remplacez par votre numéro. */}
                <span>+229 01 97 97 97 97</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {/* Adresse e-mail. Remplacez par votre e-mail. */}
                <span>contact@clinia.bj</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} CLINIA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
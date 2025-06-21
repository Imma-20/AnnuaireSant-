import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

// N'oubliez pas d'importer ces composants si vous utilisez Shadcn UI pour les radios
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const ConnexionUser = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: ''
  });
  // NOUVEAU: État pour le rôle sélectionné, par défaut 'user'
  const [selectedRole, setSelectedRole] = useState<'user' | 'health_structure'>('user');

  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [backendError, setBackendError] = useState('');

  const { toast } = useToast();
  const { login, register, loadingAuth } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberMeEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Réinitialiser les erreurs liées aux mots de passe ou aux champs standards
    if (e.target.name === 'password' || e.target.name === 'password_confirmation') {
      setBackendError('');
      setPasswordMatchError(false);
    }
    if (['email', 'prenom', 'nom', 'telephone'].includes(e.target.name)) {
      setBackendError('');
    }
  };

  // NOUVEAU: Gérer le changement de rôle
  const handleRoleChange = (value: 'user' | 'health_structure') => {
    setSelectedRole(value);
    setBackendError(''); // Réinitialiser l'erreur si l'utilisateur change de rôle
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(''); // Toujours réinitialiser les erreurs au début de la soumission

    if (isLogin) {
      // Logique de connexion
      try {
        await login(formData.email, formData.password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
      } catch (error: any) {
        // Gérer les messages d'erreur du backend plus proprement
        const errorMessage = error.message || "Une erreur inconnue est survenue.";
        setBackendError(errorMessage);
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      // Logique d'inscription
      if (formData.password !== formData.password_confirmation) {
        setPasswordMatchError(true);
        setBackendError('Les mots de passe ne correspondent pas.');
        toast({
          title: "Erreur d'inscription",
          description: "Les mots de passe ne correspondent pas.",
          variant: "destructive",
        });
        return; // Arrêter l'exécution si les mots de passe ne correspondent pas
      }

      try {
        await register(
          formData.prenom,
          formData.nom,
          formData.email,
          formData.telephone,
          formData.password,
          formData.password_confirmation,
          selectedRole // <-- C'est ici que nous passons le rôle sélectionné !
        );
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé !",
        });
        // Optionnel: Réinitialiser le formulaire après une inscription réussie
        setFormData({
            prenom: '',
            nom: '',
            email: '',
            telephone: '',
            password: '',
            password_confirmation: ''
        });
        setSelectedRole('user'); // Réinitialiser le rôle par défaut
        setIsLogin(true); // Rediriger l'utilisateur vers la page de connexion
      } catch (error: any) {
        // Gérer les messages d'erreur du backend plus proprement
        const errorMessage = error.message || "Une erreur inconnue est survenue.";
        setBackendError(errorMessage);
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Connectez-vous à votre compte'
              : 'Créez votre compte pour accéder aux fonctionnalités personnalisées'
            }
          </p>
          {backendError && (
            <p className="text-red-500 text-sm mt-2">{backendError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom" className="text-gray-700 font-medium">
                    Prénom
                  </Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nom" className="text-gray-700 font-medium">
                    Nom
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="telephone" className="text-gray-700 font-medium">
                  Téléphone
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Ex: 0123456789"
                    required
                  />
                </div>
              </div>

              {/* NOUVEAU: Sélecteur de Rôle */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Vous êtes ?</Label>
                <RadioGroup
                  defaultValue="user"
                  value={selectedRole} // Connecte la RadioGroup à l'état selectedRole
                  onValueChange={handleRoleChange} // Gère les changements de valeur
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="role-user" />
                    <Label htmlFor="role-user">Un utilisateur individuel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="health_structure" id="role-health_structure" />
                    <Label htmlFor="role-health_structure">Une structure de santé</Label>
                  </div>
                </RadioGroup>
              </div>
              {/* FIN NOUVEAU: Sélecteur de Rôle */}

            </>
          )}

          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Mot de passe
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="password_confirmation" className="text-gray-700 font-medium">
                Confirmer mot de passe
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500 ${
                    passwordMatchError ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordMatchError && (
                <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={localStorage.getItem('rememberMeEmail') === formData.email}
                  onChange={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem('rememberMeEmail', formData.email);
                    } else {
                      localStorage.removeItem('rememberMeEmail');
                    }
                  }}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <Label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
            disabled={loadingAuth}
          >
            {loadingAuth ? (
              'Chargement...'
            ) : isLogin ? (
              <>
                <User className="w-5 h-5 mr-2" />
                Se connecter
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                S'inscrire
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
          </p>
          <button
            type="button"
            onClick={() => {
                setIsLogin(!isLogin);
                setBackendError('');
                setPasswordMatchError(false);
                setFormData({
                    prenom: '',
                    nom: '',
                    email: '',
                    telephone: '',
                    password: '',
                    password_confirmation: ''
                });
                setSelectedRole('user'); // Réinitialiser le rôle par défaut lors du changement de mode
            }}
            className="mt-2 text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnexionUser;
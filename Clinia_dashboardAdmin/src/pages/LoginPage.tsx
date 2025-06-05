import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Logo de l'application */}
        <div className="flex justify-center">
          <img
            src="assets/logo.png" // Remplacez "logo.jpg" par le chemin correct vers votre logo
            alt="Logo de l'application"
            className="w-24 h-24 rounded-full"
          />
        </div>

        {/* Titre du formulaire */}
        <h2 className="text-center text-2xl font-bold text-gray-700">Admin Login</h2>

        {/* Formulaire */}
        <form className="space-y-4" action="#" method="POST">
			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700">
				Email
				</label>
				<input
				id="email"
				name="email"
				type="email"
				autoComplete="email"
				required
				className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
				/>
			</div>
			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-700">
				Password
				</label>
				<input
				id="password"
				name="password"
				type="password"
				autoComplete="current-password"
				required
				className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
				/>
			</div>
			<div className="flex items-center justify-between">
				<label htmlFor="remember-me" className="flex items-center text-sm text-gray-600">
				<input
					id="remember-me"
					name="remember-me"
					type="checkbox"
					className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
				/>
				<span className="ml-2">Se souvenir</span>
				</label>
				<a href="/forgot-password" className="text-sm text-green-600 hover:underline">
				Mot de passe oublié ?
				</a>
			</div>
			<div>
				<button
				type="submit"
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
				>
				Se connecter
				</button>
			</div>
		  	<p className="text-sm text-gray-600">
				Pas encore de compte ?{" "}
				<a href="/register" className="text-green-600 hover:underline">
					Inscrivez-vous
				</a>
			</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

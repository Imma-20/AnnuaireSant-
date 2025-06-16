import React, { useState } from "react";
import { FiX, FiMoreHorizontal } from "react-icons/fi"; // Icônes pour le modal et les options

interface Article {
    id: number;
    title: string;
    category: string;
    date: string;
    status: "Pending" | "Approved" | "Rejected";
    author: string;
    content: string;
}

const ArticleTable = () => {
    const articles: Article[] = [
        {
            id: 1,
            title: "Les bienfaits de la méditation pour la santé mentale",
            category: "Bien-être",
            date: "2025-06-01",
            status: "Pending",
            author: "Alice Dupont",
            content: "La méditation est une pratique ancestrale qui gagne en popularité pour ses nombreux bienfaits sur la santé mentale. En quelques minutes par jour, elle peut réduire le stress, améliorer la concentration et favoriser un état de calme intérieur. De nombreuses études scientifiques ont démontré son efficacité. Il existe différentes formes de méditation, comme la pleine conscience ou la méditation transcendantale, chacune ayant ses spécificités. L'important est de trouver celle qui vous convient le mieux et de la pratiquer régulièrement pour en ressentir les effets positifs sur le long terme."
        },
        {
            id: 2,
            title: "L'importance de l'hydratation quotidienne",
            category: "Santé",
            date: "2025-06-02",
            status: "Pending",
            author: "Bob Martin",
            content: "L'eau est essentielle à la vie et joue un rôle crucial dans presque toutes les fonctions corporelles. Une bonne hydratation est vitale pour maintenir l'énergie, la concentration et le bon fonctionnement des organes. La quantité d'eau nécessaire varie en fonction de l'activité physique, du climat et de l'état de santé général. Il est recommandé de boire au moins 1.5 à 2 litres d'eau par jour, et plus si vous faites de l'exercice ou par temps chaud. N'attendez pas d'avoir soif pour boire, car la soif est déjà un signe de déshydratation légère. Pensez aux tisanes, aux fruits et légumes riches en eau pour varier les apports."
        },
        {
            id: 3,
            title: "Alimentation équilibrée : la base d'une bonne santé",
            category: "Bien-être",
            date: "2025-06-03",
            status: "Approved",
            author: "Carole Leroy",
            content: "Adopter une alimentation équilibrée est la pierre angulaire d'une bonne santé. Cela signifie consommer une variété d'aliments de tous les groupes, en privilégiant les fruits, les légumes, les céréales complètes et les protéines maigres. Il est important de limiter les sucres ajoutés, les graisses saturées et le sel. Une alimentation saine permet de prévenir de nombreuses maladies chroniques, de maintenir un poids sain et d'avoir de l'énergie au quotidien. N'hésitez pas à consulter un nutritionniste pour des conseils personnalisés."
        },
        {
            id: 4,
            title: "Gestion du stress et ses impacts sur le corps",
            category: "Santé",
            date: "2025-06-04",
            status: "Pending",
            author: "David Moreau",
            content: "Le stress est une réaction naturelle du corps, mais lorsqu'il devient chronique, il peut avoir des effets néfastes sur la santé physique et mentale. Apprendre à gérer son stress est essentiel pour maintenir l'équilibre. Des techniques comme la respiration profonde, l'exercice physique régulier, le sommeil suffisant et la pratique de loisirs peuvent aider. Identifier les sources de stress et développer des stratégies pour y faire face sont des étapes clés. En cas de stress intense ou persistant, il est conseillé de demander l'aide d'un professionnel."
        },
        {
            id: 5,
            title: "Les avantages de l'exercice physique régulier",
            category: "Bien-être",
            date: "2025-06-05",
            status: "Approved",
            author: "Émilie Petit",
            content: "L'activité physique régulière est un pilier de la santé et du bien-être. Elle contribue à renforcer le système cardiovasculaire, à maintenir un poids sain, à améliorer l'humeur et à réduire le risque de maladies chroniques. Il n'est pas nécessaire de devenir un athlète de haut niveau pour en tirer des bénéfices ; 30 minutes d'activité modérée la plupart des jours de la semaine suffisent. Que ce soit la marche, la course, la natation ou le vélo, l'important est de bouger et d'intégrer l'exercice dans votre routine quotidienne."
        },
        {
            id: 6,
            title: "Comprendre les bases de la nutrition",
            category: "Santé",
            date: "2025-06-06",
            status: "Pending",
            author: "François Gérard",
            content: "La nutrition est l'étude de la façon dont les aliments et les boissons affectent le corps. Comprendre les bases de la nutrition est fondamental pour faire des choix alimentaires éclairés et maintenir une bonne santé. Les macronutriments (glucides, protéines, lipides) et les micronutriments (vitamines, minéraux) jouent tous un rôle essentiel. Chaque aliment apporte des nutriments différents, d'où l'importance d'une alimentation variée et équilibrée pour couvrir tous les besoins de l'organisme. Une bonne nutrition est un investissement à long terme pour votre vitalité."
        },
        {
            id: 7,
            title: "Les bienfaits insoupçonnés du sommeil",
            category: "Bien-être",
            date: "2025-06-07",
            status: "Pending",
            author: "Sophie Dubois",
            content: "Le sommeil est bien plus qu'un simple repos ; c'est une fonction vitale qui permet au corps et à l'esprit de se régénérer. Un sommeil suffisant et de qualité est crucial pour la santé physique, mentale et émotionnelle. Il influence l'humeur, la concentration, le système immunitaire et la régulation hormonale. Les adultes ont généralement besoin de 7 à 9 heures de sommeil par nuit. Des routines de sommeil régulières, un environnement propice et éviter les écrans avant le coucher peuvent améliorer la qualité de votre sommeil et votre bien-être général."
        },
        {
            id: 8,
            title: "L'impact du numérique sur nos yeux",
            category: "Santé",
            date: "2025-06-08",
            status: "Approved",
            author: "Thomas Durand",
            content: "À l'ère numérique, nos yeux sont de plus en plus sollicités par les écrans. La fatigue oculaire numérique est un problème courant, causant des symptômes comme des yeux secs, des maux de tête et une vision floue. Pour protéger vos yeux, adoptez la règle 20-20-20 (toutes les 20 minutes, regardez quelque chose à 20 pieds pendant 20 secondes), ajustez la luminosité et le contraste de l'écran, et clignez des yeux régulièrement. Une bonne hygiène visuelle est essentielle pour prévenir les désagréments liés à l'utilisation prolongée des appareils numériques."
        },
        {
            id: 9,
            title: "Le rôle des probiotiques dans la digestion",
            category: "Bien-être",
            date: "2025-06-09",
            status: "Pending",
            author: "Laura Bernard",
            content: "Les probiotiques sont des micro-organismes vivants qui, lorsqu'ils sont consommés en quantités adéquates, confèrent un bénéfice pour la santé de l'hôte. Ils sont particulièrement connus pour leur rôle dans la santé digestive, en contribuant à l'équilibre de la flore intestinale. On les trouve dans les aliments fermentés comme le yaourt, le kéfir, la choucroute, ou sous forme de compléments alimentaires. Une flore intestinale équilibrée est liée à une meilleure digestion, une meilleure absorption des nutriments et un système immunitaire renforcé. N'hésitez pas à en parler à un professionnel de santé."
        },
        {
            id: 10,
            title: "Premiers secours: les gestes qui sauvent",
            category: "Santé",
            date: "2025-06-10",
            status: "Pending",
            author: "Pauline Dubois",
            content: "Connaître les gestes de premiers secours peut faire la différence entre la vie et la mort en cas d'urgence. Apprendre à réagir face à un malaise, une blessure, un étouffement ou un arrêt cardiaque est une compétence précieuse pour tous. Des formations existent pour acquérir ces connaissances et ces réflexes. Savoir alerter correctement les secours, prodiguer les premiers soins en attendant leur arrivée, et assurer la sécurité de la victime et des témoins sont des actions simples mais cruciales. Chaque citoyen devrait être formé aux premiers secours pour pouvoir agir efficacement en cas de besoin."
        },
    ];

    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const handleReadArticle = (article: Article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    const handleApprove = (id: number) => {
        alert(`Article ${id} approuvé ! (Logique à implémenter)`);
        handleCloseModal();
    };

    const handleReject = (id: number) => {
        alert(`Article ${id} rejeté ! (Logique à implémenter)`);
        handleCloseModal();
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:text-gray-200"> {/* Mode sombre pour le conteneur principal */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700"> {/* Mode sombre pour la bordure */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Articles à approuver</h2> {/* Mode sombre pour le titre */}
            </div>

            <div className="overflow-y-auto max-h-96">
                {articles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"> {/* Mode sombre pour les bordures et le survol des éléments */}
                        {/* Colonne de gauche: Titre, Catégorie, Auteur */}
                        <div className="flex items-center flex-grow min-w-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"> {/* Mode sombre pour l'icône de catégorie */}
                                <span className="text-lg font-bold">{article.category.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-800 font-medium truncate dark:text-gray-200">{article.title}</p> {/* Mode sombre pour le texte du titre */}
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">Par {article.author} - {article.category}</p> {/* Mode sombre pour le sous-texte */}
                            </div>
                        </div>

                        {/* Colonne du milieu: Date et Statut (si besoin) */}
                        <div className="flex items-center text-sm text-gray-500 mx-4 flex-shrink-0 dark:text-gray-400"> {/* Mode sombre pour le texte de la date */}
                            <span>{article.date}</span>
                        </div>

                        {/* Colonne de droite: Boutons d'action et "Lire l'article" */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200
                                           dark:bg-red-700 dark:text-white dark:hover:bg-red-800" // Mode sombre pour le bouton de rejet
                                onClick={() => handleReject(article.id)}
                            >
                                Rejeter
                            </button>
                            <button
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200
                                           dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" // Mode sombre pour le bouton d'approbation
                                onClick={() => handleApprove(article.id)}
                            >
                                Approuver
                            </button>
                            <button
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 focus:outline-none
                                           dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700" // Mode sombre pour le bouton d'options
                                onClick={() => handleReadArticle(article)}
                                aria-label="Lire l'article"
                            >
                                <FiMoreHorizontal className="text-lg" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal d'affichage du contenu de l'article */}
            {showModal && selectedArticle && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6 relative dark:bg-gray-800 dark:text-gray-200"> {/* Mode sombre pour le fond et le texte du modal */}
                        {/* Bouton Fermer */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl dark:text-gray-400 dark:hover:text-gray-100" // Mode sombre pour le bouton de fermeture
                            aria-label="Fermer"
                        >
                            <FiX />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">{selectedArticle.title}</h3> {/* Mode sombre pour le titre du modal */}
                        <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Par {selectedArticle.author} | Catégorie: {selectedArticle.category} | Publié le: {selectedArticle.date}</p> {/* Mode sombre pour le sous-texte du modal */}
                        <div className="max-h-96 overflow-y-auto mb-6 pr-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-gray-300">{selectedArticle.content}</p> {/* Mode sombre pour le contenu du modal */}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                className="bg-red-500 text-white px-5 py-2 rounded-md font-medium hover:bg-red-600"
                                onClick={() => handleReject(selectedArticle.id)}
                            >
                                Rejeter
                            </button>
                            <button
                                className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700"
                                onClick={() => handleApprove(selectedArticle.id)}
                            >
                                Approuver
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleTable;
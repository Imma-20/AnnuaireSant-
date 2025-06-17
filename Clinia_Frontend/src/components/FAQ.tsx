import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Comment rechercher un établissement de santé ?",
      answer:
        "Recherchez un établissement via la barre de recherche puis cliquez sur le bouton 'Rechercher'. Ensuite sélectionnez selon votre choix le type de structure, l’assurance et remplissez les informations demandées."
    },
    {
      question: "Puis-je consulter la disponibilité des médecins ou spécialistes ?",
      answer:
        "Oui, chaque fiche d’établissement affiche les spécialités disponibles et les créneaux de disponibilité des médecins, si l'établissement a activé cette option."
    },
    {
      question: "Est-ce que l'application est gratuite à utiliser ?",
      answer:
        "Oui, l’utilisation de l’application est entièrement gratuite . Certaines fonctionnalités avancées peuvent être réservées aux professionnels de santé abonnés."
    },
    {
      question: "Comment savoir si un médicament est disponible dans une pharmacie ?",
      answer:
        "Utilisez la section 'Pharmacies' et tapez le nom du médicament. Vous verrez la liste des pharmacies proches qui ont signalé sa disponibilité."
    },
    {
      question: "Puis-je enregistrer mes établissements préférés ?",
      answer:
        "Oui, vous pouvez ajouter des établissements en favoris pour y accéder plus rapidement depuis votre tableau de bord."
    },
    {
      question: "Comment signaler une erreur dans les informations d’un centre ?",
      answer:
        "Chaque fiche dispose d'une section  'Commenter'. Cliquez dessus, décrivez le problème, et notre équipe se chargera de la vérification."
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
           FAQ
          </h2>
          <p className="text-muted-foreground text-lg">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

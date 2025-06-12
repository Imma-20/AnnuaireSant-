
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Comment ajouter mon entreprise sur CongoFinder ?",
      answer: "Pour ajouter votre entreprise, cliquez sur le bouton 'Ajouter une entreprise' en haut de la page. Remplissez le formulaire avec les informations de votre entreprise et soumettez-le pour validation."
    },
    {
      question: "Est-ce que l'inscription est gratuite ?",
      answer: "Oui, l'inscription de base est entièrement gratuite. Vous pouvez ajouter votre entreprise et ses informations principales sans frais. Des options premium sont disponibles pour plus de visibilité."
    },
    {
      question: "Comment puis-je modifier les informations de mon entreprise ?",
      answer: "Connectez-vous à votre compte et accédez à votre tableau de bord. Vous pourrez y modifier toutes les informations de votre entreprise en temps réel."
    },
    {
      question: "Quelles sont les villes couvertes par CongoFinder ?",
      answer: "CongoFinder couvre toutes les principales villes du Congo-Brazzaville, notamment Brazzaville, Pointe-Noire, Dolisie, et toutes les autres communes du pays."
    },
    {
      question: "Comment contacter une entreprise listée ?",
      answer: "Chaque fiche d'entreprise contient les informations de contact disponibles : téléphone, email, adresse, et parfois les réseaux sociaux."
    },
    {
      question: "Puis-je laisser un avis sur une entreprise ?",
      answer: "Oui, vous pouvez laisser des avis et noter les entreprises après avoir créé un compte. Cela aide les autres utilisateurs à faire de meilleurs choix."
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Questions fréquemment posées
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


import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import AlaUne from "@/components/ALaUne";
import BeninMap from "@/components/BeninMap";
import PublicationsRecentes from "@/components/PublicationsRecentes";
import FAQ from "@/components/FAQ";
import ResultatsRecherche from "@/components/ResultatsRecherches";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onSearch={handleSearch} />
      {showResults ? (
        <ResultatsRecherche query={searchQuery} category={selectedCategory} />
      ) : (
        <>
          <FeaturedCategories onCategorySelect={(category) => handleSearch("", category)} />
          <AlaUne />
          <BeninMap />
          <PublicationsRecentes />
          <FAQ />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;

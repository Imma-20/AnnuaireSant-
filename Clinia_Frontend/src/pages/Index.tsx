
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import PopularBusinesses from "@/components/PopularBusinesses";
import BeninMap from "@/components/BeninMap";
import RecentPublications from "@/components/RecentPublications";
import FAQ from "@/components/FAQ";
import SearchResults from "@/components/SearchResults";
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
        <SearchResults query={searchQuery} category={selectedCategory} />
      ) : (
        <>
          <FeaturedCategories onCategorySelect={(category) => handleSearch("", category)} />
          <PopularBusinesses />
          <BeninMap />
          <RecentPublications />
          <FAQ />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;

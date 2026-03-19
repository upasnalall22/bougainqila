import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JournalSection from "@/components/JournalSection";

const Journal = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <JournalSection />
    </main>
    <Footer />
  </div>
);

export default Journal;

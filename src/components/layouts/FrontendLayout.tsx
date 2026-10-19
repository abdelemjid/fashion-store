import Footer from "../home/Footer";
import Navbar from "../navbar/Navbar";
import SearchInput from "../ui/SearchInput";

interface Props {
  children: React.ReactNode;
}

export default function FrontendLayout({ children }: Props) {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />
      {/* Search Bar */}
      <SearchInput />
      {/* Page Content */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}

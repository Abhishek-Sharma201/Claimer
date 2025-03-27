import SearchBar from "./search-bar"
import SupportOptions from "./support-options"
import FaqSection from "./faq-section"
import MoreHelpSection from "./more-help-section"
// import Footer from "./footer"
import UserProfile from "./user-profile"

export default function MainContent() {
  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-gray-800 p-4 flex justify-between items-center">
        <SearchBar placeholder="Search claims, documents, or get help..." />
        <UserProfile name="Ritik Ray" email="ritikray@gmail.com" avatar="/placeholder.svg?height=40&width=40" />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Got Questions? We've Got Answers!</h1>
          <p className="text-gray-400">Explore our FAQs or reach out to our support team.</p>
        </div>

        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search for topics or questions" />
          </div>
        </div>

        <SupportOptions />
        <FaqSection />
        <MoreHelpSection />
      </main>

      {/* <Footer /> */}
    </div>
  )
}


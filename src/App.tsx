import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import StatsBanner from './components/StatsBanner';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Prices from './components/Prices';
import Booking from './components/Booking';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppChat from './components/WhatsAppChat';

function App() {
  return (
    <div className="min-h-screen bg-black-900 text-white">
      <Navbar />
      <Hero />
      <About />
      <StatsBanner />
      <Services />
      <Gallery />
      <Testimonials />
      <Prices />
      <Booking />
      <Contact />
      <Footer />
      <WhatsAppChat />
    </div>
  );
}

export default App;

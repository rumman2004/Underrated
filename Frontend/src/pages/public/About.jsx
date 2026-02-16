import React from 'react';
import { Target, ShieldCheck, Map, Heart, HelpCircle, Users, Globe, Sparkles, Mail, ArrowRight } from 'lucide-react';
import { PrimaryButton } from '../../components/common/Buttons';
import { useNavigate } from 'react-router-dom';
import { usePlaces } from '../../context/PlaceContext';

const About = () => {
  const navigate = useNavigate();
  const { places } = usePlaces(); 

  return (
    <div className="bg-[var(--color-bg-surface)] min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--color-sapling-300)] rounded-full blur-[80px] md:blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[var(--color-darkblue-50)] border border-[var(--color-darkblue-100)] text-[var(--color-darkblue-600)] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
            <Sparkles className="w-3 h-3" />
            Our Mission
          </div>
          
          <h1 className="text-3xl md:text-7xl font-serif font-bold text-[var(--color-darkblue-900)] mb-6 md:mb-8 tracking-tight leading-tight">
            We believe the best places <br />
            <span className="text-[var(--color-darkblue-500)] italic">are the ones missing from the map.</span>
          </h1>
          
          <p className="text-sm md:text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed">
            Modern tourism is broken. Everyone visits the same 5 spots, leaving beautiful
            history and nature ignored. We built this platform to shine a light on the 
            underrated, giving you a deeper, quieter connection to the world.
          </p>
        </div>
      </section>

      {/* 2. TRUST & STATS */}
      <section className="py-8 md:py-12 border-y border-[var(--color-sapling-200)] bg-[var(--color-sapling-50)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {[
            { label: "Hidden Gems", value: places.length > 0 ? `${places.length}+` : "Growing", icon: Map },
            { label: "Active Explorers", value: "15k", icon: Users },
            { label: "Cities Covered", value: "140", icon: Globe },
            { label: "Verified Safe", value: "100%", icon: ShieldCheck },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center p-2">
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-sapling-400)] mb-2" />
              <span className="text-xl md:text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">{stat.value}</span>
              <span className="text-[10px] md:text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VALUE PROPOSITION */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-darkblue-900)] mb-3 md:mb-4">
                Why explorers trust us.
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm md:text-lg">
                We don't just scrape data. We curate experiences with a focus on safety, quality, and solitude.
              </p>
            </div>
            <div className="hidden md:block">
               <PrimaryButton onClick={() => navigate('/contact')} className="bg-[var(--color-sapling-300)] text-[var(--color-darkblue-900)] hover:bg-[var(--color-sapling-400)]">
                  Join the Community
               </PrimaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="group p-6 md:p-8 rounded-[2rem] bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] hover:border-[var(--color-darkblue-200)] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-[var(--color-darkblue-600)] mb-6 md:mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-darkblue-900)] mb-3 md:mb-4">100% Human Verified</h3>
              <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
                No bots, no scrapers. Every location is manually reviewed by our curators to ensure it is safe, accessible, and truly worth visiting.
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-[2rem] bg-[var(--color-darkblue-600)] text-white shadow-xl transform md:-translate-y-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[var(--color-darkblue-500)] rounded-2xl flex items-center justify-center text-[var(--color-sapling-300)] mb-6 md:mb-8 shadow-inner">
                <Target className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Strictly "Underrated"</h3>
              <p className="text-sm md:text-base text-[var(--color-darkblue-100)] leading-relaxed">
                We filter out the tourist traps. If a place has 5,000+ reviews and is always crowded, you won't find it here. We look for the quiet gems.
              </p>
            </div>

            <div className="group p-6 md:p-8 rounded-[2rem] bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] hover:border-[var(--color-darkblue-200)] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-[var(--color-darkblue-600)] mb-6 md:mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-darkblue-900)] mb-3 md:mb-4">Ready to Navigate</h3>
              <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
                Finding hidden spots is hard. We provide exact GPS coordinates and direct Google Maps integration so you never get lost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-sapling-50)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-sapling-200)] text-[var(--color-darkblue-600)] mb-4 md:mb-6">
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-darkblue-900)]">Common Questions</h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            <FaqItem 
              question="Are these places safe to visit?"
              answer="Safety is our top priority. We only list places that are accessible to the public and generally considered safe for daytime visits."
            />
            <FaqItem 
              question="Can I suggest a place?"
              answer="Absolutely! Use our Contact page to suggest hidden gems in your city."
            />
            <FaqItem 
              question="Is this service free?"
              answer="Yes! Our goal is to promote local tourism. The platform is completely free for travelers."
            />
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto bg-[var(--color-darkblue-900)] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[var(--color-darkblue-600)] rounded-full blur-[80px] md:blur-[100px] opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 p-8 md:p-20 text-center">
            <Heart className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-sapling-300)] mx-auto mb-6 md:mb-8 fill-current" />
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-white mb-4 md:mb-6">Still have questions?</h2>
            <p className="text-[var(--color-darkblue-100)] text-sm md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
              Whether you're a traveler needing advice or a local wanting to share a secret, we'd love to hear from you.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <PrimaryButton onClick={() => navigate('/')} className="w-full md:w-auto px-8 md:px-10 py-3 md:py-4 text-sm md:text-lg bg-[var(--color-sapling-300)] text-[var(--color-darkblue-900)] hover:bg-[var(--color-sapling-400)] border-none">
                Start Exploring
              </PrimaryButton>
              <button onClick={() => navigate('/contact')} className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 md:px-10 py-3 md:py-4 text-sm md:text-lg font-bold text-white border border-[var(--color-darkblue-500)] rounded-full hover:bg-[var(--color-darkblue-800)] transition-all">
                <Mail className="w-4 h-4 md:w-5 md:h-5" /> Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FaqItem = ({ question, answer }) => (
  <div className="bg-white border border-[var(--color-sapling-200)] rounded-2xl p-5 md:p-8 shadow-sm">
    <h3 className="text-base md:text-lg font-bold text-[var(--color-darkblue-900)] mb-2 md:mb-3 flex items-center gap-3">
      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--color-sapling-400)] flex-shrink-0"></div>
      {question}
    </h3>
    <p className="text-xs md:text-base text-[var(--color-text-muted)] ml-4 md:ml-5 leading-relaxed">{answer}</p>
  </div>
);

export default About;
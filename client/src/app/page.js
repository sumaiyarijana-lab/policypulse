'use client';
import LandingNavbar from '@/components/layout/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import AlertTicker from '@/components/landing/AlertTicker';
import StatsSection from '@/components/landing/StatsSection';
import ComplianceChart from '@/components/landing/ComplianceChart';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-grow">
        <HeroSection />
        <AlertTicker />
        <StatsSection />
        
        {/* Additional Branding Section */}
        <section className="py-20 bg-primary/5 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black mb-4 dark:text-white">Trusted by Environmental Agencies Globally</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                Our platform integrates seamlessly with national databases to provide a unified 
                view of e-waste compliance and sustainability metrics.
              </p>
            </motion.div>
          </div>
        </section>

        <ComplianceChart />
        
        {/* Call to Action Banner */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto bg-primary rounded-[48px] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 blur-[100px] -ml-48 -mb-48 rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Ready to make a difference?<br />Join PolicyPulse today.
              </h2>
              <p className="text-white/80 text-xl mb-10 max-w-xl font-medium">
                Whether you&apos;re a citizen reporting a violation or an organization 
                seeking compliance, we have the tools you need.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="bg-white text-primary px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
                  Create Free Account
                </Link>
                <Link href="/contact" className="bg-secondary text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform border border-white/10">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

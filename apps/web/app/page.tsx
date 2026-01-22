import HeroSection from './components/HeroSection'
import PlatformShowcase from './components/PlatformShowcase'
import ServicesHighlight from './components/ServicesHighlight'
import PortalFeatures from './components/PortalFeatures'
import AcademicPrograms from './components/AcademicPrograms'
import VirtualClassroom from './components/VirtualClassroom'
import LearningTools from './components/LearningTools'
import SocialLearning from './components/SocialLearning'
import GamificationSection from './components/GamificationSection'
import ParentFeatures from './components/ParentFeatures'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
        <section className="w-full">
          <HeroSection />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <PlatformShowcase />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <ServicesHighlight />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <PortalFeatures />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <AcademicPrograms />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <VirtualClassroom />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <LearningTools />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <SocialLearning />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <GamificationSection />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <ParentFeatures />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <TestimonialsSection />
        </section>
        
        <section className="w-full mt-6 sm:mt-8 md:mt-12">
          <CTASection />
        </section>
      </div>
    </div>
  )
}
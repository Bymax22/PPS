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
    <main className="min-h-screen">
      <HeroSection />
      <PlatformShowcase />
      <ServicesHighlight />
      <PortalFeatures />
      <AcademicPrograms />
      <VirtualClassroom />
      <LearningTools />
      <SocialLearning />
      <GamificationSection />
      <ParentFeatures />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
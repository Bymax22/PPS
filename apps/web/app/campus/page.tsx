import CampusHero from '@/features/campus/components/CampusHero'
import InstitutionalIntro from '@/features/campus/components/InstitutionalIntro'
import AcademicExcellence from '@/features/campus/components/AcademicExcellence'
import CampusExperience from '@/features/campus/components/CampusExperience'

import AboutSchool from '@/features/campus/components/AboutSchool'

export default function CampusPage() {
  return (
    <main className="overflow-x-hidden">

      <CampusHero />

            {/* Institutional Introduction */}
      <AboutSchool />

      {/* Institutional Introduction */}
      <InstitutionalIntro />

      {/* Academic Excellence */}
      <AcademicExcellence />


      {/* Campus Experience */}
      <CampusExperience />

    

 

    </main>
  )
}

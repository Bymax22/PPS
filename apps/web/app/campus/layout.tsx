import CampusHeader from '@/features/campus/components/CampusHeader'
import CampusFooter from '@/features/campus/components/CampusFooter'

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="campus-theme">
      <CampusHeader />
      {children}
      <CampusFooter />
    </div>
  )
}
import EducationSection from '@/components/common/EducationSection'
import CertificatesSection from '@/components/common/CertificatesSection'
import SectionReveal from '@/components/common/SectionReveal'
import TextSection from '@/components/common/TextSection'
import { certificates } from '@/data/certificates'
import { education } from '@/data/education'
import { profile } from '@/data/profile'
import { sectionLabels } from '@/data/site'

export default function Education() {
  return (
    <SectionReveal className="mx-auto w-full max-w-5xl">
      <TextSection
        text={profile.headings.education}
        eyebrow={sectionLabels.education}
        classNames="mb-10 text-center"
        showHighlight={false}
      />
      <div className="mx-auto max-w-3xl">
        <EducationSection items={education} />
      </div>
      <CertificatesSection certificates={certificates} />
    </SectionReveal>
  )
}

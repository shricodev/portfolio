import { buttonVariants } from '@/components/ui/button'
import { BASE_URL, PUBLIC_GMAIL } from '@/lib/constants'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Find out how I collect, use, and protect your personal information to ensure your privacy is respected.',
  alternates: {
    canonical: new URL('/privacy', BASE_URL).toString(),
  },
  //robots: {
  //  // If no longer want the crawlers to index this page, but we want them to follow
  //  // any url on this page.
  //  // index: false,
  //  follow: true,
  //},
}

export default function Page() {
  return (
    <section>
      <div className='mb-5'>
        <h1 className='title'>Privacy Policy</h1>
        <p className='text-muted-foreground'>
          I am committed to protecting your privacy and safeguarding the
          information you share with me. This privacy policy explains how I
          collect, use, and protect your personal data.
        </p>
      </div>

      <div className='mb-8 space-y-5'>
        <div>
          <h2 className='text-xl font-bold'>Information I Collect</h2>
          <p className='text-muted-foreground'>
            I may collect certain personal information that you provide,
            including your name, email address, and any additional details
            submitted through the forms.
          </p>
        </div>
        <div>
          <h2 className='text-xl font-bold'>How I Use Your Information</h2>
          <p className='text-muted-foreground'>
            The information collected is used to communicate with you. By
            submitting a form, you consent to the use of your information as
            outlined in this policy.
          </p>
        </div>
        <div>
          <h2 className='text-xl font-bold'>Data Sharing and Protection</h2>
          <p className='text-muted-foreground'>
            I do not sell or rent your personal information to any third
            parties. I employ security measures to protect your data from
            unauthorized access or misuse.
          </p>
        </div>
        <div>
          <h2 className='text-xl font-bold'>Contact Details</h2>
          <p className='text-muted-foreground'>
            If you have any questions or concerns about the privacy policy,
            please contact us at this email address:{' '}
            <a
              href={`mailto:${PUBLIC_GMAIL}`}
              className='font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground hover:transition'
            >
              {PUBLIC_GMAIL}
            </a>{' '}
            or through the contact form.
          </p>
        </div>
      </div>

      <Link
        href='/contact'
        className={buttonVariants({
          variant: 'secondary',
        })}
      >
        Contact me
      </Link>
    </section>
  )
}

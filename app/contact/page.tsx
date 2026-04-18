import ContactPage from '@/components/contact-page'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | IKW Ventures",
  description: "Get in touch with IKW Ventures for genuine Volvo spare parts enquiries and orders.",
};

const page = () => {
  return (
   <ContactPage/>
  )
}

export default page
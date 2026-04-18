import AboutPage from '@/components/about-page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "About Us | IKW Ventures",
  description: "Learn about IKW Ventures, your trusted supplier of genuine Volvo spare parts in Nigeria.",
};


const page = () => {
  return (
    <AboutPage/>
  )
}

export default page
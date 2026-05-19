import Image from "next/image";

const AboutCeoSection = () => {
  return (
    <section className="py-16 ">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Container */}
          <div className="relative">
            <Image
              src="/ceo.jpg"
              alt="IK Well"
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-lg hidden md:block">
              <p className="font-bold text-2xl">25+ Years</p>
              <p className="text-sm">Of Industry Leadership</p>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">
              About the Founder
            </h2>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
              IYKE WELL
            </h1>
            <p className="text-xl font-semibold text-gray-700 mb-4">
              Founder & CEO, IYKE-Well Ventures
            </p>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                With over 25 years of dedicated experience, IK (Ikechukwu)
                brings a wealth of expertise and a proven track record to
                IYKE WELL Ventures. As a visionary leader, he has guided the
                company to new heights, establishing it as a cornerstone of
                excellence and innovation.
              </p>
              <p>
                His leadership is defined by a deep-rooted commitment to
                customer satisfaction and ethical business practices. Beyond his
                professional achievements, IK is a passionate advocate for
                community development and sustainability, ensuring that the
                company’s growth consistently aligns with positive social
                impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCeoSection;

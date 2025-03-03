"use client";
import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <>
      <CircuitBackground />
      <AboutHero />
      <MissionSection />
      <HistorySection />
      <DepartmentSection />
      <FacilitiesSection />
      <TeamSection />
      <FaqSection />
    </>
  );
};

// Circuit Board Background Pattern Component
const CircuitBackground = () => {
  return (
    <div
      className="absolute inset-0 opacity-10 z-10"
      style={{
        backgroundImage:
          "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none", // Ensures the background doesn't interfere with clicks
      }}
    ></div>
  );
};


// About Hero Section Component
const AboutHero = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 pt-20 pb-32">
      <div className="absolute inset-0 opacity-10 -z-10" style={{
        backgroundImage:
          "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none",
      }}></div>
      <h1 className="text-4xl md:text-5xl mb-5 text-white z-10">About Al Azhar<br /><span className="text-mint-green">Computer Engineering College</span></h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10 text-white/80">
        Fostering innovation and technical excellence in electronics engineering education since 1985
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="#mission"
          className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg z-10"
        >
          Our Mission
        </Link>
        <Link
          href="#facilities"
          className="py-3 px-6 bg-transparent text-electric-blue border border-electric-blue rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue/10 hover:-translate-y-0.5 hover:shadow-lg z-10"
        >
          Explore Facilities
        </Link>
      </div>
    </section>
  );
};

// Mission Section Component
const MissionSection = () => {
  return (
    <section className="py-16 px-5 bg-white/[0.02]" id="mission">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Our Mission</h2>
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <p className="text-lg text-white/80 leading-relaxed">
              At Al Azhar Computer Engineering College, our mission is to educate and empower the next generation of electronics engineers through a combination of theoretical knowledge and practical, hands-on experience.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              We are committed to fostering innovation, critical thinking, and technical excellence, preparing our students to tackle the complex challenges of the rapidly evolving technological landscape.
            </p>
            <div className="bg-electric-blue/10 border-l-4 border-electric-blue p-5 rounded">
              <p className="text-lg italic text-white m-0">
                "We believe in learning by creating, experimenting, and implementing. Our students don't just study electronics—they build the future of technology."
              </p>
              <p className="text-right text-mint-green mt-2 mb-0">— Dr. Ahmed Nasser, Dean</p>
            </div>
          </div>
          <div className="flex-1 min-w-[300px] h-[400px] bg-[#172a45] rounded-lg overflow-hidden relative">
            <img
              src="/api/placeholder/600/400"
              alt="Electronics laboratory with students working"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy via-navy/70 to-transparent p-5">
              <div className="text-mint-green text-lg font-bold">Our State-of-the-Art Electronics Lab</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// History Section Component
const HistorySection = () => {
  const timelineEvents = [
    {
      year: 1985,
      title: "Founding",
      description: "Al Azhar Computer Engineering College was established as a specialized institution focused on electronics and computer engineering."
    },
    {
      year: 1997,
      title: "Research Center",
      description: "The Advanced Electronics Research Center was founded to promote cutting-edge research and industry collaboration."
    },
    {
      year: 2005,
      title: "Curriculum Expansion",
      description: "Major curriculum revamp to include emerging technologies in IoT, renewable energy systems, and biomedical electronics."
    },
    {
      year: 2018,
      title: "Innovation Hub",
      description: "Launched the Student Innovation Hub to foster entrepreneurship and support student projects with commercial potential."
    }
  ];

  return (
    <section className="py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Our History</h2>
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-0.5 bg-electric-blue/50 transform lg:translate-x-px"></div>
          
          {/* Timeline Events */}
          {timelineEvents.map((event, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-start mb-12 relative ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Year Marker */}
              <div className="absolute left-0 lg:left-1/2 w-6 h-6 rounded-full bg-mint-green border-4 border-navy transform -translate-x-[11px] lg:-translate-x-[11px] mt-1"></div>
              
              {/* Content */}
              <div className="lg:w-1/2 pl-10 lg:pl-0 lg:pr-10 lg:text-right lg:mr-auto">
                <div className="bg-white/5 p-5 rounded-lg border border-electric-blue/20 hover:border-electric-blue transition-all">
                  <div className="text-mint-green text-xl mb-2">{event.year}</div>
                  <h3 className="text-white text-xl mb-3">{event.title}</h3>
                  <p className="text-white/80">{event.description}</p>
                </div>
              </div>
              
              {/* Empty Space for Alternate Side */}
              <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-10' : 'lg:pr-10'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Department Section Component
const DepartmentSection = () => {
  const departments = [
    {
      name: "Embedded Systems",
      description: "Specializing in designing and implementing systems that combine hardware and software for specific functions.",
      courses: ["Microcontroller Systems", "FPGA Design", "Real-Time Systems"]
    },
    {
      name: "Biomedical Electronics",
      description: "Focused on developing electronics solutions for healthcare, diagnostics, and medical treatment technologies.",
      courses: ["Medical Instrumentation", "Biosignal Processing", "Medical Imaging Systems"]
    },
    {
      name: "Power & Energy Systems",
      description: "Dedicated to innovative solutions in power generation, distribution, and renewable energy technologies.",
      courses: ["Power Electronics", "Renewable Energy Systems", "Smart Grid Technologies"]
    },
    {
      name: "Communication & Networks",
      description: "Explores wireless communication, networking technologies, and signal processing for modern communication systems.",
      courses: ["RF Circuit Design", "Digital Communications", "Network Security"]
    }
  ];

  return (
    <section className="py-16 px-5 bg-white/[0.03]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Our Departments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {departments.map((dept, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-electric-blue/20 hover:border-electric-blue transition-all hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-2xl text-white mb-3">{dept.name}</h3>
              <p className="text-white/80 mb-4">{dept.description}</p>
              <div className="mb-2 text-mint-green font-medium">Featured Courses:</div>
              <ul className="list-disc pl-5 text-white/80">
                {dept.courses.map((course, idx) => (
                  <li key={idx} className="mb-1">{course}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Facilities Section Component
const FacilitiesSection = () => {
  const facilities = [
    {
      name: "Advanced Electronics Lab",
      description: "State-of-the-art facility equipped with precision measurement instruments, PCB prototyping equipment, and analog/digital design tools.",
      icon: "🔌"
    },
    {
      name: "Robotics Workshop",
      description: "Specialized space for building and testing robotic systems with 3D printers, CNC machines, and embedded systems development kits.",
      icon: "🤖"
    },
    {
      name: "Biomedical Instrumentation Lab",
      description: "Equipped with medical sensors, biosignal acquisition systems, and tools for developing medical devices and prototypes.",
      icon: "❤️"
    },
    {
      name: "Power Systems Laboratory",
      description: "Features power electronics workstations, renewable energy simulators, and grid integration testing equipment.",
      icon: "⚡"
    },
    {
      name: "Anechoic Chamber",
      description: "Specialized room for testing RF devices, antennas, and electromagnetic compatibility of electronic devices.",
      icon: "📡"
    },
    {
      name: "Student Innovation Hub",
      description: "Collaborative workspace with development tools, component libraries, and mentorship for student-led projects and startups.",
      icon: "💡"
    }
  ];

  return (
    <section className="py-16 px-5" id="facilities">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Our Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-electric-blue/20 hover:border-electric-blue transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="text-4xl mb-4">{facility.icon}</div>
              <h3 className="text-xl text-white mb-3">{facility.name}</h3>
              <p className="text-white/80">{facility.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
          >
            Schedule a Campus Tour
          </Link>
        </div>
      </div>
    </section>
  );
};

// Team Section Component
const TeamSection = () => {
  const facultyMembers = [
    {
      name: "Dr. Ahmed Nasser",
      position: "Dean",
      specialty: "Power Electronics",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Dr. Fatima El-Sherif",
      position: "Head of Research",
      specialty: "Biomedical Instrumentation",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Prof. Mahmoud Ibrahim",
      position: "Department Chair",
      specialty: "Embedded Systems",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Dr. Laila Mostafa",
      position: "Associate Professor",
      specialty: "Signal Processing",
      image: "/api/placeholder/200/200"
    }
  ];

  return (
    <section className="py-16 px-5 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Faculty Leadership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facultyMembers.map((member, index) => (
            <div key={index} className="bg-white/5 rounded-lg overflow-hidden border border-electric-blue/20 hover:border-electric-blue transition-all hover:-translate-y-1 hover:shadow-xl text-center">
              <div className="h-48 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl text-white mb-1">{member.name}</h3>
                <div className="text-mint-green font-medium mb-1">{member.position}</div>
                <div className="text-white/70 text-sm">{member.specialty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section Component
const FaqSection = () => {
  const faqs = [
    {
      question: "What makes Al Azhar Computer Engineering College unique?",
      answer: "Our college combines theoretical education with hands-on project-based learning. We maintain strong industry partnerships that provide real-world experience opportunities and our specialized labs are equipped with cutting-edge technology for practical skills development."
    },
    {
      question: "How can I see the student projects?",
      answer: "Student projects are regularly showcased on our website and during our bi-annual Electronics Showcase Event. You can also schedule a campus visit to see current projects in our labs and innovation spaces."
    },
    {
      question: "Are there opportunities for research collaboration?",
      answer: "Yes, we actively encourage research collaborations with industry partners and other academic institutions. Contact our Research Department for specific inquiries and potential partnership opportunities."
    },
    {
      question: "How do students get involved in project teams?",
      answer: "First-year students are introduced to project teams during orientation. Students can join existing teams or form new ones based on their interests. Each team is supervised by faculty advisors who provide guidance and support throughout the project lifecycle."
    }
  ];

  return (
    <section className="py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center mb-10 text-mint-green">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 border border-electric-blue/20">
              <h3 className="text-xl text-white mb-3">{faq.question}</h3>
              <p className="text-white/80">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center text-white/80">
          <p>Have more questions? Feel free to <Link href="/contact" className="text-mint-green hover:underline">contact us</Link>.</p>
        </div>
      </div>
    </section>
  );
};


export default About;
import React from "react";

const CourseDetailsPage = () => {
  const courseDetails = {
    title: "Advanced Electronics Engineering",
    description:
      "This course provides an in-depth understanding of advanced concepts in electronics engineering, including embedded systems, signal processing, and power electronics.",
    instructor: "Dr. John Doe",
    duration: "12 weeks",
    startDate: "2025-04-01",
    syllabus: [
      "Week 1: Introduction to Embedded Systems",
      "Week 2: Advanced Signal Processing Techniques",
      "Week 3: Power Electronics Fundamentals",
      "Week 4: Microcontroller Programming",
      "Week 5: Digital Signal Processing",
      "Week 6: Renewable Energy Systems",
      "Week 7: IoT and Smart Devices",
      "Week 8: Robotics and Automation",
      "Week 9: Communication Systems",
      "Week 10: Medical Devices Engineering",
      "Week 11: AI & Machine Learning in Electronics",
      "Week 12: Final Project and Presentation",
    ],
  };

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      <section className="relative py-16 px-5 bg-white/[0.03] border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-3 text-mint-green">
            {courseDetails.title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            {courseDetails.description}
          </p>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            Instructor: {courseDetails.instructor}
          </p>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            Duration: {courseDetails.duration}
          </p>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            Start Date: {courseDetails.startDate}
          </p>
        </div>
      </section>

      <section className="py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-5 text-mint-green">Syllabus</h2>
          <ul className="list-disc pl-5 text-white/90">
            {courseDetails.syllabus.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailsPage;
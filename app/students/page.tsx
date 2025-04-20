import { getStudentsForDisplay } from "@/utils/supabase/data-services";
import StudentsFilter from "./StudentsFilter";

// Circuit Board Background Pattern Component
import CircuitBackground from "../_components/UI/CircuitBackground";

// Student Hero Section Component
const StudentHeroSection = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 h-[40vh]">
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      ></div>
      <h1 className="text-4xl md:text-5xl mb-5 text-white z-10">
        Student Engineers
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10">
        Meet the talented individuals behind our innovative electronics projects
        and learn about their specialized skills and accomplishments.
      </p>
    </section>
  );
};

// Students Page - Server Component
async function StudentsPage() {
  // Fetch student data on the server
  const students = await getStudentsForDisplay();

  return (
    <>
      <CircuitBackground />
      <StudentHeroSection />
      <StudentsFilter initialStudents={students} />
    </>
  );
}

export default StudentsPage;

import Image from "next/image";
import Link from "next/link";

// Project of the Month Component
const ProjectOfTheMonth = () => {
  return (
    <section className="py-16 px-5 bg-white/[0.02]">
      <h2 className="text-3xl text-center mb-10 text-mint-green">
        Project of the Month
      </h2>
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-10 items-center">
        <div className="flex-1 min-w-[300px] h-[300px] md:h-[400px] bg-[#172a45] rounded-lg overflow-hidden relative">
          <Image
            src="https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//default-project-image.png"
            alt="Featured project image"
            className="w-full h-full object-cover"
            width={518}
            height={400}
          />
        </div>
        <div className="flex-1">
          <div className="inline-block py-1.5 px-3 bg-magenta text-white rounded text-sm font-bold mb-4">
            Industry Award Winner
          </div>
          <h3 className="text-3xl mt-0 mb-4 text-white">
            Neural-Enhanced Prosthetic Hand
          </h3>
          <p className="text-lg text-white/80 mb-5 leading-relaxed">
            An advanced prosthetic hand system with integrated neural feedback
            mechanisms that provide tactile sensation to users. The system
            incorporates machine learning algorithms to adapt to individual user
            patterns and improve control accuracy over time.
          </p>
          <div className="flex gap-4 mb-5 text-electric-blue text-sm">
            <span>Biomedical Engineering</span>
            <span>•</span>
            <span>12 weeks development</span>
          </div>
          <div className="flex gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green">
              <div className="w-full h-full rounded-full">
                <Image
                  className="w-full h-full rounded-full"
                  src="https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//course-image.webp"
                  alt="person image"
                  width={518}
                  height={400}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green">
              <div className="w-full h-full rounded-full">
                <Image
                  className="w-full h-full rounded-full"
                  src="https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//course-image.webp"
                  alt="person image"
                  width={518}
                  height={400}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green">
              <div className="w-full h-full rounded-full">
                <Image
                  className="w-full h-full rounded-full"
                  src="https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/projects-images//course-image.webp"
                  alt="person image"
                  width={518}
                  height={400}
                />
              </div>
            </div>
          </div>
          <Link
            href="projects"
            className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
          >
            View Full Project
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ProjectOfTheMonth;

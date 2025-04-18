import React from "react";
import UploadProjectForm from "./UploadProjectForm";

// This page component simply renders the form.
// It assumes the layout provides necessary context or wrappers.
const UploadProjectPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* You might want a heading or breadcrumbs here */}
      {/* <h1 className="text-2xl font-bold mb-6 text-dark-800 dark:text-white">Upload Project</h1> */}
      <UploadProjectForm />
    </div>
  );
};

export default UploadProjectPage;

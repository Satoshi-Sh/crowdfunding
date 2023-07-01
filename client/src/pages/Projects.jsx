import React from "react";
import { Project } from "../components";
import { sampleData } from "../assets";

const Projects = () => {
  console.log(sampleData);
  return (
    <div className="p-5 flex flex-wrap mx-auto justify-center gap-5">
      {sampleData.map((data, index) => {
        return <Project key={index} data={data} />;
      })}
    </div>
  );
};

export default Projects;

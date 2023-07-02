import React from "react";
import { useParams } from "react-router-dom";
import { sampleData } from "../assets";

const Account = () => {
  const { id } = useParams();
  const data = sampleData.find((d) => d.id === Number(id));
  console.log(data);
  return (
    <div className="pt-28">
      <h1 className="text-center  text-3xl">{data.businessName}</h1>
    </div>
  );
};

export default Account;

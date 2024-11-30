import React from "react";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
      <p className="text-lg text-gray-700">
        This is the home page of our website. We are excited to share our story
        with you.
      </p>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-3">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Service 1</h3>
            <p>Description of our first amazing service.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Service 2</h3>
            <p>Description of our second amazing service.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Service 3</h3>
            <p>Description of our third amazing service.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

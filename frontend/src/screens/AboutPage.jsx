import React from "react";
import { Github, Linkedin, Mail, Terminal, Code, Server } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            About TaskMaster
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            A powerful task management platform built to help teams collaborate
            and achieve more together.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We believe in making task management simple and effective. Our
              platform is designed to help teams organize their work,
              collaborate seamlessly, and track progress efficiently. With
              intuitive features and a user-friendly interface, we're committed
              to enhancing productivity for teams of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Built With Modern Technologies
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <Terminal className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Frontend</h3>
              <ul className="text-gray-600 space-y-2">
                <li>React</li>
                <li>Tailwind CSS</li>
                <li>DND Kit</li>
                <li>React Router</li>
              </ul>
            </div>
            <div className="text-center p-6">
              <Server className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Backend</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="text-center p-6">
              <Code className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Features</h3>
              <ul className="text-gray-600 space-y-2">
                <li>Real-time Updates</li>
                <li>Drag and Drop</li>
                <li>Responsive Design</li>
                <li>Secure Authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Developer
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col items-center">
                <img
                  src="/api/placeholder/150/150"
                  alt="Payam Hoseini"
                  className="w-32 h-32 rounded-full mb-4 bg-gray-200"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Payam Hoseini
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Full Stack Developer specializing in modern web applications
                  with a focus on user experience and scalable architecture.
                </p>

                {/* Social Links */}
                <div className="flex gap-4">
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="mailto:your.email@example.com"
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about TaskMaster or interested in contributing to the
            project? Feel free to reach out through any of the social links
            above.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

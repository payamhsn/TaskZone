import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Users,
  Layout,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Manage your tasks with ease and collaboration
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Streamline your workflow, collaborate with team members, and
                achieve more together with our intuitive task management
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/api/placeholder/600/400"
                alt="Task Management Platform"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need for efficient task management
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layout className="h-8 w-8 text-blue-500" />}
              title="Intuitive Boards"
              description="Create and organize tasks with our drag-and-drop interface. Visualize your workflow with customizable boards."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="Team Collaboration"
              description="Work together seamlessly with real-time updates, task assignments, and team communications."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-blue-500" />}
              title="Task Tracking"
              description="Track progress, set due dates, and never miss a deadline with our comprehensive task management tools."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-500" />}
              title="Boost Productivity"
              description="Streamline your workflow and get more done with our efficient task organization system."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-500" />}
              title="Secure Platform"
              description="Your data is protected with industry-standard security measures and regular backups."
            />
            <FeatureCard
              icon={<Layout className="h-8 w-8 text-blue-500" />}
              title="Custom Workflows"
              description="Create custom workflows that match your team's unique processes and requirements."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Workspace"
              description="Sign up and create your first board to start organizing your tasks."
            />
            <StepCard
              number="2"
              title="Add Your Tasks"
              description="Create lists and add tasks with details, due dates, and assignments."
            />
            <StepCard
              number="3"
              title="Collaborate & Track"
              description="Invite team members, collaborate in real-time, and track progress together."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using our platform to manage their
            tasks efficiently.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }) => {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;

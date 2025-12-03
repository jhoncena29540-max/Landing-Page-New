import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC<{user: any}> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
              Build Landing Pages with <span className="text-primary">AI Magic</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              Describe your business in one sentence, and our Gemini-powered AI will generate a production-ready, high-converting landing page in seconds.
            </p>
            <div className="flex justify-center gap-4">
              <Link to={user ? "/dashboard" : "/signup"} className="bg-primary hover:bg-indigo-700 text-white text-lg font-semibold px-8 py-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {user ? "Go to Dashboard" : "Start Building for Free"}
              </Link>
              <a href="#how-it-works" className="bg-white hover:bg-gray-50 text-gray-700 text-lg font-semibold px-8 py-4 rounded-xl border border-gray-200 transition">
                How it Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to launch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-primary mb-6">
                <i className="fa-solid fa-robot text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Powered</h3>
              <p className="text-gray-500">
                Powered by Google Gemini 2.5 Flash. Generates structure, copy, and styling instantly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-secondary mb-6">
                <i className="fa-solid fa-palette text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Design</h3>
              <p className="text-gray-500">
                Beautifully crafted layouts using Tailwind CSS. Responsive, accessible, and clean.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <i className="fa-solid fa-rocket text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Publish</h3>
              <p className="text-gray-500">
                Host your pages on our platform with a single click. Share your unique link immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="relative">
              <div className="text-9xl font-bold text-gray-100 absolute -top-12 left-1/2 transform -translate-x-1/2 -z-10">1</div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-gray-500">Create your free account to access the dashboard.</p>
            </div>
            <div className="relative">
              <div className="text-9xl font-bold text-gray-100 absolute -top-12 left-1/2 transform -translate-x-1/2 -z-10">2</div>
              <h3 className="text-xl font-bold mb-2">Describe</h3>
              <p className="text-gray-500">Tell the AI what kind of landing page you need.</p>
            </div>
            <div className="relative">
              <div className="text-9xl font-bold text-gray-100 absolute -top-12 left-1/2 transform -translate-x-1/2 -z-10">3</div>
              <h3 className="text-xl font-bold mb-2">Publish</h3>
              <p className="text-gray-500">Review, save, and publish your page to the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Simple Pricing</h2>
            <p className="mt-4 text-xl text-gray-500">Start for free, upgrade as you grow.</p>
          </div>
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex justify-center">
                <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-primary">
                  Pro Plan
                </span>
              </div>
              <div className="mt-4 flex justify-center items-baseline text-6xl font-extrabold text-gray-900">
                $0
                <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
              </div>
              <p className="mt-5 text-lg text-gray-500 text-center">
                Free during beta period. Unlimited generations.
              </p>
            </div>
            <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-base text-gray-700">Unlimited AI Generations</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-base text-gray-700">Free Hosting</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-check text-green-500"></i>
                  </div>
                  <p className="ml-3 text-base text-gray-700">Analytics (Coming Soon)</p>
                </li>
              </ul>
              <div className="mt-10">
                <Link to="/signup" className="block w-full text-center rounded-lg border border-transparent bg-gray-900 px-6 py-4 text-xl font-medium text-white shadow hover:bg-gray-800 transition">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
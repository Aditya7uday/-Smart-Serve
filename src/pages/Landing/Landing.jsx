import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Utensils, ShieldCheck, Smartphone, Truck, Star, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-primary-orange font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-orange animate-pulse"></span>
              Live at University Canteen
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-dark-text tracking-tight mb-8">
              Smart Ordering. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange to-orange-500">Faster Service.</span>
            </h1>
            <p className="text-xl text-secondary-gray mb-10 leading-relaxed">
              Skip the line and get your food faster. Order ahead from the campus canteen and pick it up hot, or get it delivered straight to your dorm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary-orange rounded-full shadow-lg shadow-orange-200 hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Order Food Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-dark-text bg-white border-2 border-gray-100 rounded-full hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                Explore Menu
              </Link>
            </div>
          </div>
          
          <div className="mt-20 relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-100/50">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80" 
              alt="Delicious restaurant food" 
              className="w-full h-[400px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-text mb-4">How It Works</h2>
            <p className="text-lg text-secondary-gray max-w-2xl mx-auto">Get your favorite canteen meals in four simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Smartphone, title: '1. Browse Menu', desc: 'Explore categories and find what you crave.' },
              { icon: Utensils, title: '2. Customize', desc: 'Add extras, remove ingredients, make it yours.' },
              { icon: Zap, title: '3. Order & Pay', desc: 'Checkout quickly with multiple payment options.' },
              { icon: Clock, title: '4. Enjoy', desc: 'Track your order live and collect when ready.' },
            ].map((step, idx) => (
              <div key={idx} className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-primary-orange" />
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-3">{step.title}</h3>
                <p className="text-secondary-gray">{step.desc}</p>
                {idx < 3 && <div className="hidden md:block absolute top-12 right-0 w-8 border-t-2 border-dashed border-gray-200 -mr-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-text mb-4">Why Smart Serve?</h2>
            <p className="text-lg text-secondary-gray max-w-2xl mx-auto">Designed specifically for campus life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 transition-transform hover:-translate-y-1">
              <Clock className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-dark-text mb-3">Zero Wait Time</h3>
              <p className="text-secondary-gray">Order from your classroom and pick it up exactly when it's hot and ready.</p>
            </div>
            <div className="p-8 rounded-3xl bg-green-50/50 border border-green-100 transition-transform hover:-translate-y-1">
              <Truck className="w-10 h-10 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-dark-text mb-3">Dorm Delivery</h3>
              <p className="text-secondary-gray">Too busy studying? Our student delivery network brings it right to your door.</p>
            </div>
            <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100 transition-transform hover:-translate-y-1">
              <ShieldCheck className="w-10 h-10 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold text-dark-text mb-3">Quality Assured</h3>
              <p className="text-secondary-gray">Read reviews from fellow students and see exact inventory availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-24 bg-dark-text text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">A Platform for Everyone</h2>
              <p className="text-gray-400 text-lg mb-8">Smart Serve connects the entire campus food ecosystem through dedicated interfaces.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary-orange" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">For Students & Staff</h4>
                    <p className="text-gray-400">Order, track, pay, and review with a beautiful mobile-first experience.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">For Delivery Staff</h4>
                    <p className="text-gray-400">Manage assigned deliveries, update statuses, and track earnings.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">For Admin</h4>
                    <p className="text-gray-400">Live dashboard for order management, inventory, and menu updates.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-orange to-orange-600 rounded-3xl transform rotate-3 opacity-20 blur-lg" />
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" 
                alt="Restaurant staff" 
                className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-dark-text mb-6">Make your next canteen order smarter.</h2>
          <p className="text-xl text-secondary-gray mb-10">Join thousands of students saving time every day.</p>
          <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-primary-orange rounded-full shadow-xl shadow-orange-200 hover:bg-orange-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

// Quick fallback for User icon since I didn't import it at the top properly
function User(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

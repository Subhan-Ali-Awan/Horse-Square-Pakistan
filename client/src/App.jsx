import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home/Home';
import { Marketplace } from './pages/Marketplace/Marketplace';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { SellHorse } from './pages/SellHorse/SellHorse';
import { Auction } from './pages/Auction/Auction';
import { Breeding } from './pages/Breeding/Breeding';
import { VetDoctor } from './pages/VetDoctor/VetDoctor';
import { RidingSchool } from './pages/RidingSchool/RidingSchool';
import { Contact } from './pages/Contact/Contact';
import { Blog } from './pages/Blog/Blog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
          <div>
            <Navbar />
            <main className="pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/sell" element={<SellHorse />} />
                <Route path="/auction" element={<Auction />} />
                <Route path="/breeding" element={<Breeding />} />
                <Route path="/vet" element={<VetDoctor />} />
                <Route path="/riding-school" element={<RidingSchool />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { api } from './api.js';
import Gate from './components/Gate.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Histoire from './components/Histoire.jsx';
import Programme from './components/Programme.jsx';
import Lieu from './components/Lieu.jsx';
import Chambres from './components/Chambres.jsx';
import Acces from './components/Acces.jsx';
import Dresscode from './components/Dresscode.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    api.getSession()
      .then(({ authenticated }) => setUnlocked(authenticated))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    const ids = ['histoire', 'programme', 'lieu', 'chambres', 'acces', 'dresscode'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  if (checkingSession) return null;

  return (
    <>
      {!unlocked && <Gate onUnlock={() => setUnlocked(true)} />}
      <div id="top" style={{ filter: unlocked ? 'none' : 'blur(20px)', pointerEvents: unlocked ? 'auto' : 'none' }} aria-hidden={!unlocked}>
        <Nav active={activeSection} />
        <Hero />
        <Histoire />
        <Programme />
        <Lieu />
        <Chambres enabled={unlocked} />
        <Acces />
        <Dresscode />
        <Footer />
      </div>
    </>
  );
}

import CustomCursor from '@/components/CustomCursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Expertise from '@/components/Expertise';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Stack from '@/components/Stack';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <div style={{ background: '#000', color: '#fff', fontFamily: 'var(--font-body)', overflowX: 'clip' }}>
        <Nav />
        <Hero />
        <Expertise />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

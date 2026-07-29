import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

/**
 * The page itself is a server component — only the chrome that has to react
 * to the visitor (nav state, the instrument) ships JavaScript. The content a
 * hiring manager came for is in the HTML.
 */
export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Experience />
      <About />
      <Skills />
      <Contact />
      <Footer year={new Date().getFullYear()} />
    </PageShell>
  );
}

import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftPanelSlider from './LeftsPanelSlider';
import Navbar from './Header';
import Footer from './Footer';

const Layout = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setShowHeader(window.scrollY > 10);
    };

    const darkObserver = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    darkObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      darkObserver.disconnect();
    };
  }, []);

  // Show navbar always on mobile, else only when scrolling
  const shouldShowNavbar = isMobile || showHeader;

  // Navbar fixed on top when visible
  const navbarClass = shouldShowNavbar
    ? 'fixed top-0 w-full z-50'
    : 'hidden';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className={navbarClass}>
        <Navbar />
      </div>

      {/* Content area with conditional padding-top */}
      <div className={`flex flex-1 flex-col md:flex-row `}>
        {/* Left panel (desktop only) */}
        <div className="hidden md:block w-1/2 bg-gray-100 dark:bg-gray-900 h-screen">
          <LeftPanelSlider />
        </div>

        {/* Main outlet */}
        <main className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 h-full md:h-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer always visible */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

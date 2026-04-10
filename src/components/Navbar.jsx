import { searchImg } from '../utils';
import { navLists } from '../constants';

const navLinks = {
  Email: "mailto:prajwalm882@gmail.com",           // Replace with your email
  LinkedIn: "https://www.linkedin.com/in/prajwalkaruneshmishra/", // Replace with your LinkedIn URL
  Home: "#/",                                          // Refreshes the home page (hash-based for GH Pages)
  GitHub: "https://github.com/mishraprajwal",          // Replace with your GitHub URL
  About: "#/about"                                          // About page route (hash-based)
};

const Navbar = () => {
  return (
    <header className="w-full py-4 sm:py-5 sm:px-10 px-4 flex justify-between items-center">
      <nav className="flex w-full screen-max-width items-center">
        <div className="flex flex-1 justify-center gap-3 sm:gap-5">
          {navLists.map((nav) => (
            <a
              key={nav}
              href={navLinks[nav]}
              onClick={(e) => {
                // handle internal hash-based nav for Home / About so clicking the same link reloads
                if (nav === 'Home' || nav === 'About') {
                  e.preventDefault();
                  const desired = navLinks[nav] || '#/';
                  const normalize = (s) => {
                    if (!s) return '/';
                    if (s.startsWith('#')) return s.slice(1);
                    return s;
                  };
                  const current = normalize(window.location.hash || window.location.pathname);
                  const want = normalize(desired);
                  if (current === want) {
                    // same page -> force full reload/refresh
                    try { window.location.reload(); } catch (err) { window.location.hash = desired; }
                  } else {
                    // navigate via hash (triggers hashchange listener)
                    window.location.hash = desired;
                  }
                }
                // external links will follow default behavior
              }}
              target={nav === "Home" || nav === "About" ? "_self" : "_blank"}
              rel={nav === "Home" || nav === "About" ? undefined : "noopener noreferrer"}
              className="text-xs sm:text-sm cursor-pointer text-gray hover:text-white transition-all whitespace-nowrap"
            >
              {nav}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
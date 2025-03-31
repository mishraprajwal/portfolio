import { searchImg } from '../utils';
import { navLists } from '../constants';

const navLinks = {
  Email: "mailto:prajwalm882@gmail.com",           // Replace with your email
  LinkedIn: "https://www.linkedin.com/in/prajwalkaruneshmishra/", // Replace with your LinkedIn URL
  Home: "/portfolio/",                                          // Refreshes the home page
  GitHub: "https://github.com/mishraprajwal",          // Replace with your GitHub URL
  About: "#"                                          // Placeholder for About page
};

const Navbar = () => {
  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        <div className="flex flex-1 justify-center max-sm:hidden">
          {navLists.map((nav) => (
            <a
              key={nav}
              href={navLinks[nav]}
              target={nav === "Home" || nav === "About" ? "_self" : "_blank"}
              rel={nav === "Home" || nav === "About" ? undefined : "noopener noreferrer"}
              className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
            >
              {nav}
            </a>
          ))}
        </div>
        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          <img src={searchImg} alt="search" width={18} height={18} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
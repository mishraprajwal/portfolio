import React from 'react';
import { footerLists } from '../constants';

const footerLinks = {
  Facebook: "https://www.facebook.com/mishraaprajwal", // Replace with your profile
  Instagram: "https://www.instagram.com/mishraprajwal7", // Replace with your profile
  X: "https://twitter.com/mishraaprajwal",             // Replace with your profile (formerly Twitter)
  Home: "/"                                         // Home navigates to the home page
};

const Footer = () => {
  return (
    <footer className="py-8 bg-black text-gray-400">
      <div className="max-w-6xl mx-auto px-5">
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs">&copy; 2024 mishraprajwal. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              {footerLists.map((item) => (
                <a
                  key={item}
                  href={footerLinks[item]}
                  target={item === "Home" ? "_self" : "_blank"}
                  rel={item === "Home" ? undefined : "noopener noreferrer"}
                  className="text-xs hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
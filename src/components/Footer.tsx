import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {

  const colors = {
    jacarta: "#3A345B",
    queenPink: "#F3C8DD",
    middlePurple: "#D183A9",
    oldLavender: "#71557A",
    brownChocolate: "#4B1535",
  };

  return (
    <footer 
      className="w-full border-t-4" 
      style={{ 
        backgroundColor: colors.jacarta, 
        borderColor: colors.middlePurple,
        color: colors.queenPink 
      }}
    >
      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Brand Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-black text-2xl uppercase tracking-tighter text-white">
              Repoforge
            </h2>
          </div>
          <p className="text-sm opacity-80 max-w-xs leading-relaxed">
            It will write a readme for you TwT
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap gap-8 md:gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Navigation</span>
            <Link to="/" className="text-sm font-semibold hover:text-white transition-colors">
              Home
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Community</span>
            <a 
              href="https://github.com/aleezazahra/repoforge" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-sm font-semibold hover:text-white transition-colors"
            >
              <Github size={16} /> GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar — FIXED: Added closing </div> here */}
      <div 
        className="py-6 text-center text-xs font-bold uppercase tracking-[0.2em]"
        style={{ 
          backgroundColor: "rgba(0,0,0,0.2)", 
          color: colors.oldLavender 
        }}
      >
        © {new Date().getFullYear()} — Built by <span className="text-white">Aleeza</span>
      </div> 
    </footer>
  );
};

export default Footer;
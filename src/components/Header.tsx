import { Link } from 'react-router-dom';

const Header = () => {
  const colors = {
    jacarta: "#3A345B",
    brownChocolate: "#4B1535",
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/10 backdrop-blur-md px-10 py-4 flex justify-between items-center border-b border-white/20">
      
   
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <h1 
          style={{ fontFamily: "Gwendolyn, cursive",color: colors.jacarta  }} 
          className="text-5xl drop-shadow-sm"
   
        >
          RepoForge
        </h1>
      </Link>

  
      <div className="hidden md:block">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">
      readme for your projects
        </span>
      </div>
    </header>
  );
};

export default Header;
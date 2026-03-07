import { Route,Routes,BrowserRouter } from "react-router-dom";
import './index.css'
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";


const App=()=>{
  return(
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
    
    </Routes>
    <Footer />

    </BrowserRouter>
  )

}
export default App;
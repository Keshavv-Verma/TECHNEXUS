import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/home';
import Electronics from './routes/Electronics'
import Mobandaccess from './routes/Mobandaccess'
import More from './routes/More'
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Category from './components/Category/Category';
import SingleProduct from './components/SingleProduct/SingleProduct';
import AppContext from "./utils/context";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import SuccessPage from './components/SuccessPage/SuccessPage';
import ProductPage from './components/productpage/productpage';
import AuthForm from './components/Login/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    const hasAlertBeenShown = localStorage.getItem('alertShown');

    if (!hasAlertBeenShown) {
      alert('This project is only for project purpose so i am using free plan of strapi for backend that could fetch data slow please wait for it or refresh after 30 to 40s...');
      localStorage.setItem('alertShown', 'true');
    }
  }, []);

  const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <AppContext>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Electronics' element={<Electronics />} />
            <Route path='/Mobandaccess' element={<Mobandaccess />} />
            <Route path='/More' element={<More />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path='/success' element={<SuccessPage/>} />
            <Route path='/productpage/:id' element={<ProductPage/>} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Footer />
        </AppContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
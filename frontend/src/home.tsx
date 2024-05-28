import homePage from './assets/2cc2baa2-1894-418c-8234-65c1a596b251.webp';
import { useNavigate } from 'react-router-dom';
import './button.css';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/form');
  };

  return (
    <div 
      className="relative font-lato h-screen w-screen overflow-hidden"
    >
      <img src={homePage} alt="home page" className="object-cover h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
          Welcome to Your AI Travel Agent
        </h1>
        <button className="buttonHome learn-more" onClick={handleClick}>
          <span className="circle" aria-hidden="true">
            <span className="icon arrow"></span>
          </span>
          <span className="buttonHome-text">Learn More</span>
        </button>
      </div>

      <div className="absolute bottom-16 left-16">
        <h1 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold">
          The best
          <h1 className='text-6xl md:text-8xl lg:text-10xl mb-6 mt-2'>AI travelling agent</h1>
          <h1 className='text-right'>for you</h1>
        </h1>
      </div>
    </div>
  );
}

export default Home;

import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Searchbar from './components/Searchbar';
import Pokedex from './components/Pokedex';
import React  ,{useState,useEffect} from 'react';
import { getPokemonData, getPokemons,searchPokemon } from './api';




function App() {

  const [pokemons,setPokemons] = useState([]);
  const [page,setPage] =useState(0);
  const [total,setTotal] = useState(0);
  const [loading,setLoading] =useState(true)
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  const fetchPokemons = async() =>{

    try {
      setLoading(true)
      const data = await getPokemons(25,25 * page);
      //setPokemons(data.results)
      const promises = data.results.map( async (pokemon) =>{
        return await getPokemonData(pokemon.url)
      })
      const results = await Promise.all(promises)
      setPokemons(results)
      setLoading(false)
      setTotal(Math.ceil(data.count / 25))
    }catch(err){

    }

  }

  useEffect(() => {
    fetchPokemons()
  }, [page])


  const onSearch = async (pokemon) => {
    if (!pokemon) {
      return fetchPokemons();
    }
    setLoading(true);
    setNotFound(false);
    setSearching(true);
    const result = await searchPokemon(pokemon);
    if (!result) {
      setNotFound(true);
      setLoading(false);
      return;
    } else {
      setPokemons([result]);
      setPage(0);
      setTotal(1);
    }
    setLoading(false);
    setSearching(false);
  };

  return (
    <div>
      <Navbar/>

      <div className="App">
          <Searchbar onSearch={onSearch} />
          {notFound ? (
            <div className="not-found-text">
              No se encontro el Pokemon que buscabas 😭
            </div>
          ) : (
            <Pokedex
              loading={loading}
              pokemons={pokemons}
              page={page}
              setPage={setPage}
              total={total}
            />
          )}
        </div>
      
      

   
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./app.css"
import "./mediaQueryApp.css"
import useSearchAbilitiesInfo from "./hooks/useSearchAbilitiesInfo";
import useSearchPokemon from "./hooks/useSearchPokemon";
import generationsNamesFormated from "./utils/pokemonGenerationsFormat";
import generationsNames from "./utils/pokemonGenerationsName";
import pokemonTypeColor from "./utils/pokemonTypeColor";

function App() {

  const [pokemonNames, setPokemonsName] = useState<string[]>([])
  const [pokemonsInfo, setPokemonsInfo] = useState([])
  const [pokemonSelected, setPokemonSelected] = useState<[number, string] | []>([])
  const [generation, setGeneration] = useState<number>(0)
  const [version, setVersion] = useState<number>(0)
  const [pokemonMoves, setPokemonMoves] = useState<any[]>([])
  const [movesFiltered, setMovesFiltered] = useState<string[][]>([[]])
  const [filter, setFilter] = useState<string>("level-up")

  const addPokemon = (pokemonName: string, arrayIndex: number) => {

    const updatePokemons: string[] = [...pokemonNames]
    updatePokemons[arrayIndex] = pokemonName

    setPokemonsName(updatePokemons)

    return
  }

  const SearchPokemon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const pokemonResult = await useSearchPokemon(pokemonNames)

    setPokemonsInfo(pokemonResult)

    return
  }

  const selectPokemon = (elementSelect: number, pokemonName: string) => {

    let updatePokemon: [number, string] | [] = [...pokemonSelected]
    updatePokemon = [elementSelect, pokemonName]

    setPokemonSelected(updatePokemon)

    return
  }

  const SearchPokemonMoves = async (indexGeneration: number, indexVersion: number) => {

    const pokemonMoves = await useSearchAbilitiesInfo(pokemonSelected[1], generationsNames[indexGeneration][indexVersion])
    
    setPokemonMoves(pokemonMoves)
    setVersion(indexVersion)

    return
  }

  const filterPokemonMoves = () => {
  
    const filtred = pokemonMoves.filter((value) => {
      if(value[4] === filter) return value 
      return false
    })

    const sortedData = filtred.sort((a, b) => a[3] - b[3])

    setMovesFiltered(sortedData)

    return
  }

  useEffect(() => {

    if(pokemonSelected.length > 0) {
      const Redefiner = async () => {
        const pokemonMoves = await useSearchAbilitiesInfo(pokemonSelected[1], generationsNames[generation][version])
        
        setPokemonMoves(pokemonMoves)
  
        return
      }

      Redefiner()
    }

    return
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonSelected])

  useEffect(() => {
    if(pokemonMoves.length > 0) {
      filterPokemonMoves()
    }

    return
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonMoves, filter])
  
  
  return (
    <div className="App">
      <header>
        <h1>PokeTeam</h1>
      </header>
      <div className="grid">
        <form className="nav" onSubmit={SearchPokemon}>
          <input className="nav-input" type="text" placeholder="Type pokemon name" onChange={(e) => addPokemon(e.target.value, 0)}/>
          <input className="nav-input" type="text" placeholder="Type pokemon name" onChange={(e) => addPokemon(e.target.value, 1)}/>
          <input className="nav-input" type="text" placeholder="Type pokemon name" onChange={(e) => addPokemon(e.target.value, 2)}/>
          <input className="nav-input" type="text" placeholder="Type pokemon name" onChange={(e) => addPokemon(e.target.value, 3)}/>
          <input className="nav-input" type="text" placeholder="Type pokemon name" onChange={(e) => addPokemon(e.target.value, 4)}/>
          <input className="nav-input" type="text" placeholder="Type pokemon name" onChange={(e) => addPokemon(e.target.value, 5)}/>
          <button className="nav-input" type="submit">Search</button>
        </form>

        <section className="pokemons">
          {pokemonsInfo.map((pokemonInfo, index) => (
            <div 
              className="pokemons-sprite"
              onClick={() => selectPokemon(index, pokemonInfo[1])}
              key={index}
              style={{"backgroundColor": pokemonTypeColor[pokemonInfo[2]], "boxShadow": `0 0 25px ${pokemonTypeColor[pokemonInfo[2]]}`, "border": index === pokemonSelected[0] ? "3px solid red" : "3px solid black"}}
              >
                <img src={pokemonInfo[0]} alt="pokemon" />
                <p className="pokemons-name">
                  {pokemonInfo[1]}
                </p>
                <p className="pokemons-types" style={{"gridColumnStart": pokemonInfo[3] === "none" ? "1" : "auto", "gridColumnEnd": pokemonInfo[3] === "none" ? "3" : "auto",}}>
                  {pokemonInfo[2]}
                </p>
                <p className="pokemons-types" style={{"display": pokemonInfo[3] === "none" ? "none" : "inherit"}}>
                  {pokemonInfo[3] === "none" ? "" : pokemonInfo[3]}
                </p>
            </div>
          ))}
        </section>

        <section className="info" style={{"display": pokemonSelected.length > 0 ? "grid" : "none"}}>
          <div className="info-generations">
            <label className="info-label" htmlFor="generations">Choose a generation</label>
            <select className="info-select" name="generations" id="generations" onChange={(e) => setGeneration(Number(e.target.value))}>
              <option value="0">Generation 1</option>
              <option value="1">Generation 2</option>
              <option value="2">Generation 3</option>
              <option value="3">Generation 4</option>
              <option value="4">Generation 5</option>
              <option value="5">Generation 6</option>
              <option value="6">Generation 7</option>
              <option value="7">Generation 8</option>
            </select>
          </div>
          <div className="info-version">
            {generationsNamesFormated[generation].map((version, index) => (
              <p key={index} onClick={() => SearchPokemonMoves(generation, index)}>{version}</p>
            ))}
          </div>
          <div className="info-method">
            <p onClick={() => setFilter("level-up")}>Leveling-up</p>
            <p onClick={() => setFilter("machine")}>Machine</p>
          </div>
          <div className="info-header">
            <p>Lv</p>
            <p>Move</p>
            <p>Type</p>
            <p>Power</p>
            <p>Accuracy</p>
          </div>
          {movesFiltered.map((value, index) => (
            <div className="info-moves" key={index}>
              <p>{value[3]}</p>
              <p>{value[5]}</p>
              <p className="info-moves-type" style={{"backgroundColor": pokemonTypeColor[value[2]] }}>
                {value[2]}
              </p>
              <p >{value[1]}</p>
              <p>{value[0]}</p>
            </div>
            ))}
        </section>
      </div>
    </div>
  );
}

export default App;

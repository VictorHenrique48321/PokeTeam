const useSearchPokemon = async (pokemonList: string[]) => {

  let pokemonResults: any = []

  await Promise.allSettled(pokemonList.map(async (pokemonName) => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const response = await data.json()
        
    pokemonResults.push([
      response["sprites"]["other"]["official-artwork"]["front_default"],
      response["name"],
      response["types"]["0"]["type"]["name"],
      typeof response["types"]["1"] === typeof undefined ? "none" : response["types"]["1"]["type"]["name"]
    ])

  }))

  return pokemonResults
}

export default useSearchPokemon
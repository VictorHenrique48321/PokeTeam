const useSearchAbilities= async (pokemonName: string | undefined, versionGame: string) => {

  let array: string[][] = [[]]

  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
  const response = await data.json()
  
  response["moves"].forEach((value: any) => {
    value["version_group_details"].forEach((pokemons: any) => {
      if(pokemons["version_group"]["name"] === versionGame) {
        array.push([
          pokemons["level_learned_at"],
          pokemons["move_learn_method"]["name"],
          value["move"]["name"]
        ])
      }
    })
  })

  return array
}

export default useSearchAbilities
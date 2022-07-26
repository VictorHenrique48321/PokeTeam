import useSearchAbilities from "./useSearchAbilities"

const useSearchAbilitiesInfo = async (pokemonName: string | undefined, versionGame: string) => {

  let movesInfo: string[][] = [[]]

  const results = await (useSearchAbilities(pokemonName, versionGame))

  await Promise.allSettled(results.map(async (moveName: any, index: number) => {
    if(typeof moveName[2] !== typeof undefined) {
      const data = await fetch(`https://pokeapi.co/api/v2/move/${moveName[2]}`)
      const response = await data.json()

      movesInfo.push([
        !response["accuracy"] ? "-" : response["accuracy"],
        !response["power"] ? "-" : response["power"],
        response["type"]["name"],
        results[index][0],
        results[index][1],
        results[index][2]!,
      ])
    }
  }))  

  return movesInfo
}

export default useSearchAbilitiesInfo
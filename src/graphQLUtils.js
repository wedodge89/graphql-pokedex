// Main generic GraphQL request
async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    'https://pokedex-app-ed.us-west-2.aws.cloud.dgraph.io/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operationsDoc,
        operationName,
        variables,
      }),
    }
  )

  return await result.json()
}

// Fetch all Pokemon
const fetchAllPokemonOperationsDoc = `
  query fetchAllPokemon {
    queryPokemon {
      id
      name
      captured
      imgUrl
      pokemonTypes
      generation
      evoStage
      altForm
    }
  }
`

function fetchAllPokemon() {
  return fetchGraphQL(fetchAllPokemonOperationsDoc, 'fetchAllPokemon', {})
}

// Fetch Pokemon by Type
const fetchPokemonOfCertainTypeOperationsDoc = (pokemonType) => `
  query fetchPokemonOfCertainType {
    queryPokemon(filter: { pokemonTypes: { eq: [${pokemonType}] } }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
      generation
      evoStage
      altForm
    }
  }
`

function fetchPokemonOfCertainType(pokemonType) {
  return fetchGraphQL(
    fetchPokemonOfCertainTypeOperationsDoc(pokemonType),
    'fetchPokemonOfCertainType',
    {}
  )
}

// Fetch Pokemon by Generation
const fetchPokemonOfCertainGenerationOperationsDoc = (generation) => `
  query fetchPokemonOfCertainGeneration {
    queryPokemon(filter: { generation: { eq: [${generation}] } }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
      generation
      evoStage
      altForm
    }
  }
`

function fetchPokemonOfCertainGeneration(generation) {
  return fetchGraphQL(
    fetchPokemonOfCertainGenerationOperationsDoc(generation),
    'fetchPokemonOfCertainGeneration',
    {}
  )
}

// Fetch Pokemon by Captured Status
const fetchPokemonByCapturedStatusOperationsDoc = (isCaptured) => `
  query fetchPokemonByCapturedStatus {
    queryPokemon(filter: { captured: ${isCaptured} }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
      generation
      evoStage
      altForm
    }
  }
`

function fetchPokemonByCapturedStatus(isCaptured) {
  return fetchGraphQL(
    fetchPokemonByCapturedStatusOperationsDoc(isCaptured),
    'fetchPokemonByCapturedStatus',
    {}
  )
}

// Fetch Pokemon by Type and by Captured Status
const fetchPokemonOfCertainTypeAndByCapturedStatusOperationsDoc = ({
  pokemonType,
  isCaptured,
  generation
}) => `
  query fetchPokemonOfCertainTypeAndByCapturedStatus {
    queryPokemon(filter: { captured: ${isCaptured}, pokemonTypes: { eq: [${pokemonType}] } }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
      generation
      evoStage
      altForm
    }
  }
`

function fetchPokemonOfCertainTypeAndByCapturedStatus({
  pokemonType,
  isCaptured,
}) {
  return fetchGraphQL(
    fetchPokemonOfCertainTypeAndByCapturedStatusOperationsDoc({
      pokemonType,
      isCaptured,
    }),
    'fetchPokemonOfCertainTypeAndByCapturedStatus',
    {}
  )
}

// Fetch Pokemon
// Combines all the cases into a nice single function serving as a facade over the underlying complexity
export function fetchPokemon({ pokemonType, isCaptured, generation }) {
  if (pokemonType !== 'Any' && isCaptured !== 'Any' && generation !== 'Any') {
    return fetchPokemonOfCertainTypeAndByCapturedStatus({
      pokemonType,
      isCaptured: isCaptured === 'Captured',
      generation
    })
  } else if (pokemonType !== 'Any') {
    return fetchPokemonOfCertainType(pokemonType)
  } else if (isCaptured !== 'Any') {
    return fetchPokemonByCapturedStatus(isCaptured === 'Captured')
  } else if (generation !== 'Any') {
    return fetchPokemonOfCertainGeneration(generation)
  }

  return fetchAllPokemon()
}

// Update the Pokemon Captured Status
const updatePokemonCapturedStatusOperationsDoc = (
  pokemonName,
  newIsCapturedValue
) => `
  mutation MyMutation(captured: newIsCapturedValue) {
    updatePokemon(input: {filter: {name: {alloftext: ${pokemonName}}}, set: {captured: ${newIsCapturedValue}}}) {
      pokemon {
        altForm
        captured
        evoStage
        generation
        id
        imgUrl
        name
        pokemonTypes
      }
    }
  }
`

export function updatePokemonCapturedStatus(pokemonName, newIsCapturedValue) {
  return fetchGraphQL(
    updatePokemonCapturedStatusOperationsDoc(pokemonName, newIsCapturedValue),
    'updatePokemonCapturedStatus',
    {}
  )
}

import Correios from 'node-correios'

// testing purposes
export const correios = new Correios()

const northStates = [
  'AP',
  'AM',
  'PA',
  'RO'
]

const northStatesCapitals = [
  'Macapá',
  'Manaus',
  'Belém',
  'Porto Velho'
]

const northeastStates = [
  'MA',
  'PI',
  'CE',
  'RN',
  'PB',
  'PE',
  'AL',
  'SE'
]

const northeastStatesCapitals = [
  'São Luís',
  'Teresina',
  'Fortaleza',
  'Natal',
  'João Pessoa',
  'Recife',
  'Maceió',
  'Aracaju'
]

const southeastStates = [
  'ES',
  'MG',
  'RJ',
  'SP'
]

const southeastStatesCapitals = [
  'Vitória',
  'Belo Horizonte',
  'Rio de Janeiro',
  'São Paulo'
]

const southStates = [
  'PR',
  'SC',
  'RS'
]

const southStatesCapitals = [
  'Curitiba',
  'Florianópolis',
  'Porto Alegre'
]

const midwestStates = [
  'DF',
  'GO',
  'MT',
  'MS'
]

const midwestStatesCapitals = [
  'Brasília',
  'Goiânia',
  'Cuiabá',
  'Campo Grande'
]

const capitals = northStatesCapitals
.concat(northeastStatesCapitals)
.concat(southeastStatesCapitals)
.concat(southStatesCapitals)
.concat(midwestStatesCapitals)

export const isCapital = (city) => {
  for(let i = 0; i < capitals.length; i++) {
    if(city === capitals[i]) return true
  }
  return false
}

export const isSouth = (state) => {
  for(let i = 0; i < southStates.length; i++) {
    if(state === southStates[i]) return true
  }
  return false
}

export const isSoutheast = (state) => {
  for(let i = 0; i < southeastStates.length; i++) {
    if(state === southeastStates[i]) return true
  }
  return false
}

export const isDF = (state) => {
  return state === midwestStates[0]
}

export const isMidwest = (state) => {
  for(let i = 0; i < midwestStates.length; i++) {
    if(state === midwestStates[i]) return true
  }
  return false
}

export const isNortheast = (state) => {
  for(let i = 0; i < northeastStates.length; i++) {
    if(state === northeastStates[i]) return true
  }
  return false
}

export const isNorth = (state) => {
  for(let i = 0; i < northStates.length; i++) {
    if(state === northStates[i]) return true
  }
  return false
}

export const calculateDelivery = (postcode) => {
  const args = {
    nCdServico: '41106', // service code (PAC)
    sCepOrigem: '13213086', // dafiti CEP
    sCepDestino: postcode,
    nVlPeso: '2', // 2KG como default
    nCdFormato: 1, // package format (box)
    nVlComprimento: 16.0, // comprimento da encomenda
    nVlAltura: 3.0, // altura da encomenda
    nVlLargura: 11.0, // largura da encomenda
  }

  return new Promise((resolve, reject) => {
    correios.calcPrecoPrazo(args, (error, result) => {
      if(error) return reject(error)

      return resolve(result)
    })
  })
}

/*
Tipagem do objeto de informações dos Atletas
type Athletic  = {
  age: string,
  city: string,
  event: string,
  games: string,
  height: string,
  id:string:string,
  medal: string,
  name:string,
  noc:string,
  season: string,
  sex: string,
  sport:string,
  team:string,
  weight:string,
  year:string
} 
*/

const processCSVData = csvData => {
  // Divide as linhas do CSV
  const lines = csvData.split('\n')

  // Remove a primeira linha (cabeçalho)
  const headers = lines[0].split(',')

  const pessoas = []

  // Itera sobre as linhas para extrair os dados das pessoas
  for (var i = 1; i < lines.length; i++) {
    const obj = {}
    const currentLine = lines[i].split(',')

    // Preenche o objeto com os dados
    for (var j = 0; j < headers.length; j++) {
      const headerValue = headers[j] ? headers[j].trim() : '' // Verifica se headers[j] é definido
      const lineValue = currentLine[j]
        ? currentLine[j].trim() === 'NA'
          ? 'NENHUMA'
          : currentLine[j].trim()
        : '' // Verifica se currentLine[j] é definido
      obj[headerValue.replace(/[\\"]/g, '').toLowerCase()] = lineValue.replace(
        /[\\"]/g,
        '',
      ) // Montando o Objeto de cada pessoa
    }

    // Adiciona o objeto ao array de pessoas
    pessoas.push(obj)
  }

  // Filtra o array de pessoas pelo esporte "basketball"
  return pessoas.filter((pessoa, index) => {
    return pessoa.sport && pessoa.sport.toLowerCase() === 'basketball' // Verifica se pessoa.sport está definido
  })
}

const listaDePaises = atletas => {
  const lista = new Set() // Estrutura de dados imutavel e que não se repete
  atletas.forEach(pessoa => {
    // Faz um for dentro da lista
    const country = pessoa.team // Pega o time que é o pais

    lista.add(country) // pega o pais e adiciona na lista
  })
  return Array.from(lista)
}

const buscarPaisesSemMedalhaFeminina = pessoas => {
  const mulherSemMedalhas = pessoas.filter(mulher => {
    if (
      mulher.medal === 'NENHUMA' &&
      mulher.sex === 'F' &&
      mulher.season === 'Summer'
    ) {
      return mulher
    }
  })

  return listaDePaises(mulherSemMedalhas) // Gera um Array a partir da lista
}

const paisComMaisMedalhas = pessoas => {
  const medalhasPorPais = {}
  pessoas.forEach(objeto => {
    const pais = objeto.team
    const medalha = objeto.medal
    // verifica se a medalha é de ouro e se o país já está no objeto de contagem.
    if (medalha === 'Gold') {
      if (medalhasPorPais[pais]) {
        // Se o país já estiver no objeto, incrementamos o número de medalhas de ouro.
        medalhasPorPais[pais]++
      } else {
        // Se o país ainda não estiver no objeto, iniciamos a contagem com 1.
        medalhasPorPais[pais] = 1
      }
    }
  })
  // as variáveis para armazenar o país com mais medalhas de ouro e o número de medalhas.
  var paisMaisMedalhas = ''
  var maxMedalhas = 0

  //  sobre as chaves (nomes dos países) do objeto de contagem.
  Object.keys(medalhasPorPais).forEach(pais => {
    //  se o número de medalhas deste país é maior do que o máximo atual.
    if (medalhasPorPais[pais] > maxMedalhas) {
      // Se for, atualizamos o país com mais medalhas e o número máximo de medalhas.
      paisMaisMedalhas = pais
      maxMedalhas = medalhasPorPais[pais]
    }
  })

  //  o país com mais medalhas de ouro.
  return paisMaisMedalhas
}

const atletaJovem = atletas => {
  let menorIdade = 100
  let atletaName = ''
  atletas.forEach(atleta => {
    if (atleta.medal === 'Gold' && atleta.age < menorIdade) {
      menorIdade = atleta.age
      atletaName = atleta.name
    }
  })
  return { name: atletaName, age: menorIdade }
}

/*
 Nessa função como o nome já indica, possui o objetivo de encontrar o atleta mais alto que já competiu nas olimpiadas. 
 Primeiramente removemos os atletas que não possuem alturas declaradas em nossos dados via .filter()
 Depois utilizamos do .reduce() para encontrar o atleta mais alto.
 Sendo que o que o .reduce() retorna é a saída de nossa função.
*/
const altetaDeBasqueteMaisAltoQueJaCompetiuNasOlimpiadas = atletas => {
  return atletas
    .filter(atleta => atleta.height !== 'NENHUMA')
    .reduce((acc, atleta) => {
      return !acc || Number(atleta.height) > Number(acc.height) ? atleta : acc
    }, null)
}

/*
Nessa função buscamos saber qual cidade sede teve mais jogadoras femininas ao longo das olimpiadas.
Para que isso seja possivel começamos com um .filter() salvando então uma cópia contendo somente as jogadoras de basquete.
Depois disso vamos para a contagem de cidades e utilizamos do .reduce() como de costume onde ela conta o número de jogadoras por cidade.
Note que o trecho "acc[atleta.City] = (acc[atleta.City] || 0) + 1" verifica se a cidade já está no acumulador. Caso esteja, incrementa o contador. Se não, inicializa o contador em 1.
Após essas duas etapas iniciais utilizamos novamente o .reduce() agora em cima dos pares cidade e contagem pertencetes ao cidadecComMaisJogadoras.
O contador inicia como null e a cada iteração verificamos se a cidade atual tem mais jogadoras do que a cidade armazenada no acumulador. Caso tenha, atualizamos as informações.
Enfim a função retorna o nome da cidade que teve mais jogadoras.
*/

const cidadeAnfitriaDeJogosOndeTeveMaisAtletasFemininas = atletas => {
  const jogadorasDeBasquete = atletas.filter(atleta => atleta.sex === 'F')

  const contagemDeCidades = jogadorasDeBasquete.reduce((acc, atleta) => {
    acc[atleta.city] = (acc[atleta.city] || 0) + 1
    return acc
  }, {})

  const cidadeComMaisJogadoras = Object.entries(contagemDeCidades).reduce(
    (acc, [cidade, contagem]) => {
      return !acc || contagem > acc.contagem ? { cidade, contagem } : acc
    },
    null,
  )

  return cidadeComMaisJogadoras.cidade
}

/*
As próximas 4 funções respeitam o mesmo padrão de:
Primeiro filtrar atletas por gênero, medalha de ouro ou ausência de medalha e sua altura.
Depois calcula-se a altura total com um reduce, que é uma simples soma de todos os valores de altura com acc iniciando em 0 pra não dar ruim.
Por fim, temos um return com uma média airtmética do total pela quantidade de atletas que filtramos.
*/

const mediaDaAlturaDeAtletasMasculinosComOuro = atletas => {
  const atletasMasculinosOuro = atletas.filter(
    atleta =>
      atleta.sex === 'M' &&
      atleta.medal === 'Gold' &&
      atleta.height !== 'NENHUMA',
  )
  const totalDaAltura = atletasMasculinosOuro.reduce(
    (acc, atleta) => acc + Number(atleta.height),
    0,
  )
  const media = totalDaAltura / atletasMasculinosOuro.length
  return Number(media.toFixed(2))  // Retorna o número com 2 casas decimais
}

const mediaDaAlturaDeAtletasMasculinosSemMedalha = atletas => {
  const atletasMasculinosSemMedalha = atletas.filter(
    atleta =>
      atleta.sex === 'M' &&
      atleta.medal === 'NENHUMA' &&
      atleta.height !== 'NENHUMA',
  )
  const totalDaAltura = atletasMasculinosSemMedalha.reduce(
    (acc, atleta) => acc + Number(atleta.height),
    0,
  )
  const media = totalDaAltura / atletasMasculinosSemMedalha.length
  return Number(media.toFixed(2))  // Retorna o número com 2 casas decimais
}

const mediaDaAlturaDeAtletasFemininasComOuro = atletas => {
  const atletasFemininasOuro = atletas.filter(
    atleta =>
      atleta.sex === 'F' &&
      atleta.medal === 'Gold' &&
      atleta.height !== 'NENHUMA',
  )
  const totalDaAltura = atletasFemininasOuro.reduce(
    (acc, atleta) => acc + Number(atleta.height),
    0,
  )
  const media = totalDaAltura / atletasFemininasOuro.length
  return Number(media.toFixed(2))  // Retorna o número com 2 casas decimais
}

const mediaDaAlturaDeAtletasFemininasSemMedalha = atletas => {
  const atletasFemininasSemMedalha = atletas.filter(
    atleta =>
      atleta.sex === 'F' &&
      atleta.medal === 'NENHUMA' &&
      atleta.height !== 'NENHUMA',
  )
  const totalDaAltura = atletasFemininasSemMedalha.reduce(
    (acc, atleta) => acc + Number(atleta.height),
    0,
  )
  const media = totalDaAltura / atletasFemininasSemMedalha.length
  return Number(media.toFixed(2))  // Retorna o número com 2 casas decimais
}

/*
Função que chama e "armazena" o resultado das 4 funções acimas para uso posterior.
*/
const mediasDeOuroESemMedalha = atletas => {
  const mediaMasculinaOuro = mediaDaAlturaDeAtletasMasculinosComOuro(atletas)
  const mediaMasculinaSemMedalha = mediaDaAlturaDeAtletasMasculinosSemMedalha(atletas)
  const mediaFemininaOuro = mediaDaAlturaDeAtletasFemininasComOuro(atletas)
  const mediaFemininaSemMedalha = mediaDaAlturaDeAtletasFemininasSemMedalha(atletas)

  return {
    mediaMasculinaOuro,
    mediaMasculinaSemMedalha,
    mediaFemininaOuro,
    mediaFemininaSemMedalha,
  }
}

const atlheticsData = fetch('/src/database/athletics.csv')
  .then(response => {
    return response.text()
  })
  .then(csvData => {
    return processCSVData(csvData)
  })

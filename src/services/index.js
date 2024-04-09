/*
Tipagem do objeto de informações dos Atletas
type Atleta = {
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
  const lines = csvData.split('\n') // Separa o documento fateando por quebra de linha
  const headers = lines[0].split(',') // Pega os valores do cabeçario da tabela que contem as categorias dos dados

  const cleanValue = value => {
    return value.trim() === 'NA' ? 'NENHUMA' : value.trim()
  } // Para o valor "NA" será posto NENHUMA no lugar para ficar claro ao desenvolvedor quando for utilizar

  const extractData = line => {
    const currentLine = line.split(',')

    return headers.reduce((obj, header, index) => {
      const headerValue = header ? header.trim() : ''
      const lineValue = currentLine[index]
        ? cleanValue(currentLine[index].trim())
        : ''
      obj[headerValue.replace(/[\\"]/g, '').toLowerCase()] = lineValue.replace(
        /[\\"]/g,
        '',
      )
      return obj
    }, {})
  } // Raliza o fateamento separando os valores antes das virgulas

  const filterBySport = pessoa => {
    return pessoa.sport && pessoa.sport.toLowerCase() === 'basketball'
  } // realiza o filtro de dados olhando somente para o esporte ao qual o site é voltado

  const pessoas = lines.slice(1).map(extractData) // a partir da segunda linha, aonde os dados de verdade começam, faz uma varedura das informações e retorna um novo array de dados no formato já desejado

  return pessoas.filter(filterBySport) // retorna os dados filtrados
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
  }) // Realiza um filtro de dados vendo quais objetos no array contem atletas que não ganharam uma competição feminina no verão

  const countries = mulherSemMedalhas.map(pessoa => pessoa.team) // Pega o nome do pais no campo team de cada objeto

  return countries.filter((country, i) => countries.indexOf(country) === i) // Gera um Array a partir da lista
}

const paisComMaisMedalhas = pessoas => {
  const contarMedalhasDeOuro = (acc, pessoa) => {
    const pais = pessoa.team
    const medalha = pessoa.medal

    if (medalha === 'Gold') {
      acc[pais] = (acc[pais] || 0) + 1
    }
    return acc
  } // Conta o numero de medalhas de cada item passado na interação

  // Contagem de medalhas de ouro por país
  const medalhasPorPais = pessoas.reduce(contarMedalhasDeOuro, {})

  // Encontrar o país com mais medalhas de ouro
  const [paisMaisMedalhas] = Object.entries(medalhasPorPais).reduce(
    ([paisAtual, maxMedalhas], [pais, medalhas]) => {
      return medalhas > maxMedalhas
        ? [pais, medalhas]
        : [paisAtual, maxMedalhas]
    },
    ['', 0],
  )

  //  o país com mais medalhas de ouro.
  return paisMaisMedalhas
}

const atletaJovem = atletas => {
  const encontrarJovemComOuro = (atletaMaisJovem, atleta) => {
    if (atleta.medal === 'Gold' && atleta.age < atletaMaisJovem.age) {
      return { name: atleta.name, age: atleta.age }
    }
    return atletaMaisJovem
  }

  return atletas.reduce(encontrarJovemComOuro, { age: Infinity }) // retorna o nome e idade do atleta mais jovem ganhador de ouro apos verificar qual atleta é
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
  return Number(media.toFixed(2)) // Retorna o número com 2 casas decimais
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
  return Number(media.toFixed(2)) // Retorna o número com 2 casas decimais
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
  return Number(media.toFixed(2)) // Retorna o número com 2 casas decimais
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
  return Number(media.toFixed(2)) // Retorna o número com 2 casas decimais
}

const atlheticsData = fetch('/src/database/athletics.csv') // busca o documento csv que usaremos como base dados na pasta database do projeto
  .then(response => {
    return response.text()
  }) // ao ler o arquivo tranforma em texto em chamada assincrona
  .then(csvData => {
    return processCSVData(csvData) // ao resolver o passo anterior pega o retorno do dado e faz a leitura das informações montando um array com os objetos no formato desejado para as operações;
  })

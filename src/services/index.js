function processCSVData(csvData) {
  // Divide as linhas do CSV
  var lines = csvData.split('\n')
  // teste
  // Remove a primeira linha (cabeçalho)
  var headers = lines[0].split(',')

  var pessoas = []

  // Itera sobre as linhas para extrair os dados das pessoas
  for (var i = 1; i < lines.length; i++) {
    var obj = {}
    var currentLine = lines[i].split(',')

    // Preenche o objeto com os dados
    for (var j = 0; j < headers.length; j++) {
      var headerValue = headers[j] ? headers[j].trim() : '' // Verifica se headers[j] é definido
      var lineValue = currentLine[j]
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
  var pessoasFiltradas = pessoas.filter((pessoa, index) => {
    return pessoa.sport && pessoa.sport.toLowerCase() === 'basketball' // Verifica se pessoa.sport está definido
  })

  // Exibe os dados filtrados no console
  //console.log({ pessoasFiltradas })
  return pessoasFiltradas
}

const listaDePaises = atletas => {
  let lista = new Set() // Estrutura de dados imutavel e que não se repete
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
  var medalhasPorPais = {}
  pessoas.forEach(objeto => {
    var pais = objeto.team
    var medalha = objeto.medal
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
const altetaDeBasqueteMaisAltoQueJaCompetiuNasOlimpiadas = (atletas) => {
  return atletas.filter(atleta => atleta.Height !== 'NENHUMA').reduce((acc, atleta) => {
    return !acc || parseInt(atleta.Height) > parseInt(acc.Height) ? atleta : acc
  }, null)
}

fetch('/src/services/a.csv')
  .then(response => {
    return response.text()
  })
  .then(csvData => {
    const pessoas = processCSVData(csvData)
    const paisesSemMedalhaFeminina = buscarPaisesSemMedalhaFeminina(pessoas)
    //const paisComMaisMedalha = paisComMaisMedalhas(pessoas)
    //const atletaMaisJovem = atletaJovem(pessoas)
    //console.log(paisComMaisMedalha)
    //console.log({ PaisesSemMedalhaFeminina })
    //console.log(atletaMaisJovem)

    /*
  const divisoria = document.getElementById('mulherSemMedalha')

  paisesSemMedalhaFeminina.forEach(data => {
    let pais = document.createElement('li')
    pais.innerHTML = data
    divisoria.appendChild(pais)
  })
  */
  })

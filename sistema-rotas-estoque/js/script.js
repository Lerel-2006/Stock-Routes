/*
    Diferença entre o TSP e o Dijkstra
    Dijkstra calcula todos os custos de todos os pontos possíveis, um a um
    gera uma matriz com esses valores e depois passa para o TSP, analisar e
    dizer qual rota é a menor
    o TSP calcula apenas ponto a ponto, sem considerar corredores, prateleiras, etc
    como no mundo real e na representação 2d isso não pode acontecer
    Dijkstra → matriz → TSP → melhor ordem → caminhos físicos → desenho da rota.
    ========================================
    TSP:
        Quais ordem visitar? sem considerar espaço físico, prateleira e nem nada

    DIJKSTRA:
        Quais nós físicos passar? Agora sim eu vejo a rota considerando os corredores, prateleiras

    TSP decide onde ir primeiro

    Dijkstra decide por onde passar para chegar lá
*/
/* encontrarVizinhos() → quem está conectado a quem.
calcularPesoAresta() → quanto custa cada conexão.
encontrarVizinhosComPeso() → vizinho + custo.
criarDistancias() → distância conhecida até cada nó.
criarVisitados() → quais nós já foram processados.
encontrarNoMenorDistancia() → qual nó se deve analisar.
atualizarDistancias() → atualiza as distâncias através dos vizinhos. */
const estoque = document.getElementById("estoque");

const iconeEmpilhadeira = "🚜";

const entrada = {
    x: 450,
    y: 550
};

const corredores = [
    {
        id: 1,
        x: 350,
        y: 200,
        largura: 200,
        altura: 300,

        //preciso saber onde o corredor começa e termina
        //já que o funcionário irá passar por dentro dele para assim chegar no produtos
        //dessa forma posso desenhar o caminho no mapa sem entrar pelas prateleiras
        entradaX: 450,
        entradaY: 500,

        saidaX: 450,
        saidaY: 200
    }
];

const nos = [
    {
        id: 0,
        nome: "ENTRADA",
        x: 450,
        y: 550
    },
    {
        id: 1,
        nome: "ENTRADA CORREDOR 1",
        x: 450,
        y: 500
    },
    {
        id: 2,
        nome: "SAÍDA CORREDOR 1",
        x: 450,
        y: 200
    },
    {
        id: 3,
        nome: "POSIÇÃO 1",
        x: 150,
        y: 200
    },
    {
        id: 4,
        nome: "POSIÇÃO 2",
        x: 220,
        y: 200
    },
    {
        id: 5,
        nome: "POSIÇÃO 3",
        x: 290,
        y: 200
    }
];

const arestas = [
    {
        origem: 0,
        destino: 1,
        bidirecional: true
        //estou pegando aqui o nó de id 0 e o nó de id 1 no vetor de nós para construir minha aresta
        //a distancia não será necessária pois como tem as coordenadas dos pontos, a distância é calculada por eles
    },
    {
        origem: 1,
        destino: 2,
        bidirecional: true
    },
    {
        origem: 2,
        destino: 3,
        bidirecional: true
    },
    {
        origem: 3,
        destino: 4,
        bidirecional: true
    },
    {
        origem: 4,
        destino: 5,
        bidirecional: true
    }
];

function encontrarVizinhos(idNo){

    const vizinhos = [];

    arestas.forEach(aresta => {

        if(aresta.origem === idNo){
            vizinhos.push(aresta.destino);
        }

        if(aresta.bidirecional && aresta.destino === idNo){
            vizinhos.push(aresta.origem);
        }

    });

    return vizinhos;
}

/* console.log("vizinhos do nó 0: ", encontrarVizinhos(0));
console.log("vizinhos do nó 1: ", encontrarVizinhos(1));
console.log("vizinhos do nó 2: ", encontrarVizinhos(2));

console.log("Peso 0 -> 1: ", calcularPesoAresta(arestas[0]));
console.log("Peso 1 -> 2: ", calcularPesoAresta(arestas[1])); */


function calcularPesoAresta(aresta){
    const origem = nos[aresta.origem];
    const destino = nos[aresta.destino];

    const dx = destino.x - origem.x;
    const dy = destino.y - origem.y;

    return Math.sqrt(dx * dx + dy *dy);
    //retorna o peso da aresta no grafo que será necessário para o Dijkstra
    //pq assim posso comparar o peso das arestas para descobrir o caminho "menos pesado", ou nesse caso, mais curto

}

/* arestas.forEach(aresta => {
    const distancia = calcularPesoAresta(aresta);

    console.log(
        `${nos[aresta.origem].nome} → ${nos[aresta.destino].nome}:`,
         distancia
    );
}); */

function encontrarVizinhosComPeso(idNo){
    //mesma ideia do encontrarVizinhos, só que aqui eu coloco o peso, ou as distâncias para calcular a melhor rota
    const vizinhos = [];

    arestas.forEach(aresta => {

        if(aresta.origem === idNo){

            vizinhos.push({
                id: aresta.destino,
                distancia: calcularPesoAresta(aresta)
            });

        }

        if(aresta.bidirecional && aresta.destino === idNo){

            vizinhos.push({
                id: aresta.origem,
                distancia: calcularPesoAresta(aresta)
            });

        }
    });

    return vizinhos;
}

/* console.log(
    "Vizinhos do nó 1 com peso: ",
    encontrarVizinhosComPeso(1)
); */

//criando o nó inicial e setando
//0: 0,
//1: Infinity,
//2: Infinity
function criarDistancias(idOrigem){

    const distancias = {};

    nos.forEach(no => {
        distancias[no.id] = Infinity;
        //aqui percorro todos os nós e coloco todas as distancias de todos os pontos como infinito
        //distancias[0] = Infinity
        //distancias[1] = Infinity
        //distancias[2] = Infinity
        //isso pq e não qual o custo/distância de um nó até outro
    });

    distancias[idOrigem] = 0;

    return distancias;
}
/*
console.log(
    "Distâncias iniciais: ",
    criarDistancias(0)
);
*/
//no início nenhum nó foi visitado, por isso o forEach colocando todos como falso
//Na hr de usar o Dijkstra os nós que forem de fato visitados mudarão para true
function criarVisitados(){

    const visitados = [];

    nos.forEach(no => {
        visitados[no.id] = false;
    });

    return visitados;
}

function criarPredecessores(){
    const predecessores = {};

    nos.forEach(no => {
        predecessores[no.id] = null;
    });

    return predecessores;
}

/*
console.log(
    "Nós visitados: ",
    criarVisitados()
);
*/
function encontrarNoMenorDistancia(distancias, visitados){

    let menorDistancia = Infinity;
    let noMaisProximo = null;

    nos.forEach(no => {
        if(!visitados[no.id] && distancias[no.id] < menorDistancia){

            menorDistancia = distancias[no.id];
            noMaisProximo = no.id;

        }
    });

    return noMaisProximo;
}

function atualizarDistancias(idNo, distancias, visitados, predecessores){
    
    const vizinhos = encontrarVizinhosComPeso(idNo);

    vizinhos.forEach(vizinho => {
        if(visitados[vizinho.id]){
            return;
        }

        const novaDistancia = distancias[idNo] + vizinho.distancia;

        if(novaDistancia < distancias[vizinho.id]){
            distancias[vizinho.id] = novaDistancia;

            predecessores[vizinho.id] = idNo;//vou guardando de onde cada nó veio, exemplo o nó 4 veio do 3 que veio do 2, isso para reconstruir o caminho de trás para frente e depois inverter
        }
    });
}

/* 
const distanciasTeste2 = criarDistancias(0);
const visitadosTeste2 = criarVisitados();

atualizarDistancias(0, distanciasTeste2, visitadosTeste2);


console.log("Distâncias após analisar o nó 0: ", distanciasTeste2);
 */

function dijkstra(idOrigem){
    const distancias = criarDistancias(idOrigem);
    const visitados = criarVisitados();
    const predecessores = criarPredecessores();

    //toda vez que atualizar o nó ele será marcado como visitado
    while(true){
        const noAtual = encontrarNoMenorDistancia(
            distancias,
            visitados,
        );

        /* 
        console.log("No atual:", noAtual);
        console.log("Visitados:", visitados);
        console.log("Distâncias:", distancias);
         */

        if(noAtual === null){
            break;
        }

        visitados[noAtual] = true;

        atualizarDistancias(
            noAtual,
            distancias,
            visitados,
            predecessores
        );

    }

    console.log("Distâncias: ", distancias);
    //console.log("Visitados: ", visitados);
    console.log("Predecessores: ", predecessores);

    return {
        distancias: distancias,
        predecessores: predecessores
    };
}
/* 
const resultadoDijkstra = dijkstra(0);
const distancias1 = dijkstra(1);
const distancias2 = dijkstra(2);

console.log("Entrada → Entrada:", resultadoDijkstra.distancias[0]);
console.log("Entrada → Nó 1:", resultadoDijkstra.distancias[1]);
console.log("Entrada → Nó 2:", resultadoDijkstra.distancias[2]);
 */



function reconstruirCaminho(idOrigem, idDestino, predecessores){

    const caminho = [];

    let noAtual = idDestino;

    while(noAtual !== null){

        caminho.push(noAtual);

        if(noAtual === idOrigem){
            break;
        }

        noAtual = predecessores[noAtual];

    }

    caminho.reverse();//precisa inverter os pontos do caminho, já que o caminho é feito de forma inversa,
                      //já que pegamos qual o ponto chegar e vamos pegando seus predecessores, ponto a ponto e fazendo o caminho inverso
                      //Porém como não podemos indicar para o usuário o caminho inverso, invertemos o vetor de caminho
                      //Como o estoque é simples ele vai fazer o caminho de forma óbvia o caminho inverso, 3, 2, 1, 0
                      //Então parece que é só contar de trás para frente e parece bobagem guardar os predecessores
                      //Porém em um estoque grande e cheio de prateleiras o caminho inverso pode ser 4, 10, 1, 90, ...
                      //Já que isso vai depender da maneira como o estoque foi construído e consequente o seu grafo
                      //A intenção aqui é independente de como o usuário organize o estoque, o algoritmo seja eficaz em resolver qualquer disposição possível desse estoque/grafo
                      //Questão de organização deixa para o usuário, o algoritmo deve ser adaptável ao que ele fizer
    return caminho;
}

function encontrarCaminho(idOrigem, idDestino, resultadoDijkstra){

    const resultado = resultadoDijkstra[idOrigem];

    return reconstruirCaminho(
        idOrigem,
        idDestino, 
        resultado.predecessores
    );
}

//teste manual para reconstruir caminho, precisa da função construirCaminho() se quiser fazer com qualquer valor que o usuário digitar
const resultadoTeste = dijkstra(3);
const caminhoTeste = reconstruirCaminho(
    3, 
    5, 
    resultadoTeste.predecessores
);

console.log("Caminho 0 -> 3: ", caminhoTeste);

function criarCaminhosDaRota(resultadoTsp, pontosDoPedido, resultadoDijkstra){

    const caminhos = [];

    const rota = resultadoTsp.rota;

    for(let i = 0; i < rota.length - 1; i++){

        const indiceOrigem = rota[i];
        const indiceDestino = rota[i + 1];

        const pontoOrigem = pontosDoPedido[indiceOrigem];
        const pontoDestino = pontosDoPedido[indiceDestino];

        const caminho = encontrarCaminho(
            pontoOrigem.noId,
            pontoDestino.noId,
            resultadoDijkstra
        );

        caminhos.push(caminho);
    }

    return caminhos;
}





//essa matriz contém todas as distâncias de ponto a ponto do estoque
//depois passo para o tsp calcular qual rota é a menor
//Vai dar uma matriz simétrica, ou seja com a diagonal principal tendo todos os valores iguais à 0
//Visto que os corredores são bidirecionais, a pessoa pode ir e vir em um mesmo corredor
function criarMatrizDijkstra(){

    const matriz = [];
    const resultadosDijkstra = [];

    for(let i = 0; i < nos.length; i++){
        //Vamos passar as distancias, quanto custa chegar e por onde passei, os predecessores, assim posso traçar a rota
        const resultado = dijkstra(i);

        matriz.push(Object.values(resultado.distancias));//Guarda as distâncias

        resultadosDijkstra.push(resultado);//Guarda cada execução do dijkstra, pra traçar a rota no mapa do estoque

    }
    
    return {
        matriz: matriz,
        resultados: resultadosDijkstra
    };
}

const matrizDijkstra = criarMatrizDijkstra();
const caminhoFisico = encontrarCaminho(
    0, 
    3,
    matrizDijkstra.resultados
);

console.log("Caminho físico: ", caminhoFisico);

console.log("Matriz de Dijkstra: ", matrizDijkstra);

const caminho = encontrarCaminho(
    0,
    3,
    matrizDijkstra.resultados
);

console.log("Caminho encontrado: ", caminho);
/*
const distanciaTeste = criarDistancias(0);
const visitadosTeste = criarVisitados();

console.log(
    "Nó mais próximo: ",
    encontrarNoMenorDistancia(
        distanciaTeste,
        visitadosTeste
    )
);
*/

function desenharArestas(){
    arestas.forEach(aresta => {
        const origem = nos[aresta.origem];
        const destino = nos[aresta.destino];

        const dx = destino.x - origem.x;
        const dy = destino.y - origem.y;

        const distancia = Math.sqrt(dx * dx + dy * dy);

        const angulo = Math.atan2(dy, dx) * 180 / Math.PI;

        const linha = document.createElement("div");

        linha.classList.add("linha-grafo");

        linha.style.left = `${origem.x}px`;
        linha.style.top = `${origem.y}px`;
        linha.style.width = `${distancia}px`;

        linha.style.transform = `rotate(${angulo}deg)`;

        estoque.appendChild(linha);
    });
}

desenharArestas();

function desenharCorredores(){
    corredores.forEach(corredor => {

        //estou criando todos os corredores existentes
        //pegando do vetor corredores e colocando seus pontos x e y e suas larguras e alturas
        const elemento = document.createElement("div");

        elemento.classList.add("corredor");

        elemento.style.left = `${corredor.x}px`;
        elemento.style.top = `${corredor.y}px`;
        elemento.style.width = `${corredor.largura}px`;
        elemento.style.height = `${corredor.altura}px`;
        //elemento.style.backgroundColor = `red`;

        estoque.appendChild(elemento);
    });
}

desenharCorredores();

function desenharPontosDoCorredor(){
    corredores.forEach(corredor => {

        const entradaCorredor = document.createElement("div");
        entradaCorredor.classList.add("ponto-caminho");

        entradaCorredor.style.left = `${corredor.entradaX}px`;
        entradaCorredor.style.top = `${corredor.entradaY}px`;

        estoque.appendChild(entradaCorredor);

        const saidaCorredor = document.createElement("div");
        saidaCorredor.classList.add("ponto-caminho");

        saidaCorredor.style.left = `${corredor.saidaX}px`;
        saidaCorredor.style.top = `${corredor.saidaY}px`;

        estoque.appendChild(saidaCorredor);

    });
}

desenharPontosDoCorredor();

const posicoes = [
    {
        id: 1,
        x: 150,
        y: 100,
        z: 1.2
    },
    {
        id: 2,
        x: 220,
        y: 100,
        z: 1.8
    },
    {
        id: 3,
        x: 290,
        y: 100,
        z: 2.0
    },
];

const produtos = [
    {
        id: 1,
        nome: "Teclado Gamer",
        peso: 5,
        quantidade: 10,
        posicaoId: 1
    },
    {
        id: 2,
        nome: "Monitor",
        peso: 8,
        quantidade: 5,
        posicaoId: 2
    },
    {
        id: 3,
        nome: "Impressora",
        peso: 25,
        quantidade: 2,
        posicaoId: 3
    }
];

const pedido = [
    {
        produtoId: 3,
        quantidade: 1
    },
    {
        produtoId: 1,
        quantidade: 2
    }
];

//Desenhando as posições
posicoes.forEach(posicao => {
    const elemento = document.createElement("div");

    elemento.classList.add("posicao");

    elemento.textContent =  posicao.z >= 1.5
        ? `P${posicao.id} ${iconeEmpilhadeira}`
        : `P${posicao.id}`;

    elemento.style.left = `${posicao.x}px`;
    elemento.style.top = `${posicao.y}px`;

    estoque.appendChild(elemento);
});

function precisaEmpilhadeira(produto, posicao){
    return produto.peso >= 20 || posicao.z >= 1.5;
}

function encontrarPosicaoDoProduto(produto){
    return posicoes.find(posicao => posicao.id === produto.posicaoId);
    //O .find() percorre o array e retorna o primeiro elemento que satisfaz a condição
}

function encontrarProduto(id){
    return produtos.find(produto => produto.id === id);
}

function encontrarNoDaPosicao(posicaoId){
    return nos.find(no => no.nome === `POSIÇÃO ${posicaoId}`);
}

/* 
console.log(encontrarNoDaPosicao(1));
console.log(encontrarNoDaPosicao(2));
console.log(encontrarNoDaPosicao(3));
 */

function criarPontosDoPedido(){

    const pontos = [];

    //A entrada sempre é o primeiro ponto do pedido
    pontos.push({
        produto: "ENTRADA",
        noId: 0
    });

    pedido.forEach(item => {
        //apenas lembrando que ele vai criar essa matriz, mas sem indicar o melhor trajeto
        const produto = encontrarProduto(item.produtoId);

        const posicao = encontrarPosicaoDoProduto(produto);

        const no = encontrarNoDaPosicao(posicao.id);

        pontos.push({
            produto: produto.nome,
            produtoId: produto.id,
            posicaoId: posicao.id,
            noId: no.id
        });
    });

    return pontos;
}

/* 
const pontosDoPedido = criarPontosDoPedido(pedido);

console.log("Pontos do pedido:", pontosDoPedido);
 */

//é uma laço aninhado padrão que serve para a criação de uma matriz
function criarMatrizDoPedido(pontosDoPedido, matrizDijkstra){
    const matriz = [];

    for(let i =  0; i < pontosDoPedido.length; i++){
        
        const linha = [];

        for(let j = 0; j <  pontosDoPedido.length; j++){

            const noOrigem = pontosDoPedido[i].noId;
            const noDestino = pontosDoPedido[j].noId;

            const distancia = matrizDijkstra[noOrigem][noDestino];

            linha.push(distancia);

        }
        
        matriz.push(linha);

    }

    return matriz;
}



 
const item = pedido[0];

const produto = encontrarProduto(item.produtoId);

//console.log(produto);

function analisarProduto(produto){
    const posicao = encontrarPosicaoDoProduto(produto);

    const empilhadeira = precisaEmpilhadeira(produto, posicao);

    /* console.log("Produto: ", produto.nome);
    console.log("Posição: ", posicao.id);
    console.log("Cooordenadas: ", posicao.x, posicao.y, posicao.z);
    console.log("Precisa de empilhadeira: ", empilhadeira); */
}

analisarProduto(produtos[0]);
analisarProduto(produtos[1]);
analisarProduto(produtos[2]);

function analisarPedido(pedido){
    pedido.forEach(item => {
        const produto = encontrarProduto(item.produtoId);

        const posicao = encontrarPosicaoDoProduto(produto);

        /* console.log("-----------------------");
        console.log("Produto: ", produto.nome);
        console.log("Quantidade Solicitada: ", item.quantidade);
        console.log("Posição: ", posicao.id);
        console.log("Coordenadas: ", posicao.x, posicao.y);
        console.log("-----------------------"); */
    });
}

analisarPedido(pedido);

function criarPontosDaRota(pedido){
    const pontos = [];

    //é o ponto de início, por isso é preciso colocar ele no vetor de pontos
    pontos.push({
        produto: "ENTRADA",
        posicao: 0,
        x: entrada.x,
        y: entrada.y 
    });

    /*
    //é necessário colocar o corredor, pq se não a rota será mostra direto da entrada para o primeiro produto, atravessando prateleiras e o que houver na frente e na vida real isso não acontece
    pontos.push({
        produto: "CORREDOR",
        x: 450,
        y: 200
    });
    */

    pedido.forEach(item => {
    
        const produto = encontrarProduto(item.produtoId);
        const posicao = encontrarPosicaoDoProduto(produto);

        //aqui eu vou passando produto por produto, pegando suas infos e o que é mias importante as coordenadas para futuramente desenhar a rota no mapa do estoque e criar um efeito visual legal
        pontos.push({
            produto: produto.nome,
            posicaoId: posicao.id,
            x: posicao.x,
            y: posicao.y
        });

    });

    return pontos;
}

function calcularDistancia(pontoA, pontoB){
    const dx = pontoB.x - pontoA.x;
    const dy = pontoB.y - pontoA.y;

    return Math.sqrt(dx * dx + dy *dy);
}

function criarMatrizDeDistancias(pontos){
    const matriz = [];

    for(let i = 0; i < pontos.length; i++){
        const linha = [];

        for(let j = 0; j < pontos.length; j++){
            const distancia = calcularDistancia(
                pontos[i],
                pontos[j]
            );

            linha.push(distancia);
        }

        matriz.push(linha);
    }

    return matriz;
}

//vamos calcular a distancia de cada um dos pontos e depos somar
function calcularDistanciaDaRota(ordem, matriz){
    let distanciaTotal = 0;

    for(let i = 0; i < ordem.length - 1; i++){
        const origem = ordem[i];
        const destino = ordem[i + 1];

        distanciaTotal += matriz[origem][destino];
    }

    return distanciaTotal;
}

function gerarRotas(pontos){
    const rotas = [];

    const inicio = 0;

    for(let i = 1; i< pontos.length; i++){
        for(let j = 1; j < pontos.length; j++){
            if(i !== j){
                rotas.push([
                    inicio,
                    i,
                    j
                ]);
            }
        }
    }

    return rotas;
}

//a diferença dessa função para a de cima é que essa estou trabalhando apenas com os pontos do pedido relacionados aquela matriz de Dijkstra
function gerarRotasDoPedido(pontosDoPedido){

    const rotas = [];

    const inicio = 0;

    for(let i = 1; i < pontosDoPedido.length; i++){
        for(let j = 1; j < pontosDoPedido.length; j++){
            if(i !== j){
                rotas.push([
                    inicio,
                    i,
                    j
                ]);
            }
        }
    }

    return rotas;
}

const pontosDoPedido = criarPontosDoPedido(pedido);

const matrizDoPedido = criarMatrizDoPedido(pontosDoPedido, matrizDijkstra.matriz);

console.log("Matriz do pedido: ", matrizDoPedido);//aqui é somente a matriz que eu preciso dos pontos de rota do pedido e não inteira como em dijkstra

const rotasDoPedido = gerarRotasDoPedido(pontosDoPedido);

console.log("Rotas do pedido: ", rotasDoPedido);//o resultado aqui vai dar todas as possíveis rotas que o funcionário pode percorrer entre é claro os produtos que estão em seu pedido

const resultadoTsp = encontrarMelhorRota(rotasDoPedido, matrizDoPedido);

console.log("Melhor rota do pedido: ", resultadoTsp);//aqui exibe a melhor rota que poderíamos ter da entrada passando produto por produto e sua menor distÂncia

const caminhosDaRota = criarCaminhosDaRota(
    resultadoTsp,
    pontosDoPedido,
    matrizDijkstra.resultados
);

console.log("Caminhos físicos da rota:", caminhosDaRota);


function encontrarMelhorRota(rotas, matriz){
    let melhorRota = null;
    let menorDistancia = Infinity;//considere a menor distância inicialmente como infinita, pra depois que encontrar um primeiro valor mude ele e comece de fato as comparações de distância entre as rotas

    rotas.forEach(rota => {
        const distancia = calcularDistanciaDaRota(rota, matriz);

        /* console.log("Rota: ", rota);
        console.log("Distância: ", distancia); */

        if(distancia < menorDistancia){
            menorDistancia =  distancia;
            melhorRota = rota;
        }
    });

    return {
        rota: melhorRota,
        distancia: menorDistancia
    };
}

/* function mostrarMelhorRota(resultado, pontos){
    console.log("🏆 Melhor rota:");

    resultado.rota.forEach((indice, ordem) => {//ordem indica a posição da sequência
        const ponto = pontos[indice];

        if(indice === 0){
            console.log(`${ordem + 1}. ${ponto.produto}`);//aqui só mostra a palavra ENTRADA para o usuário
        }else{
            console.log(`${ordem + 1}. ${ponto.produto} - P${ponto.posicaoId}`);//aqui mostra a posição e o nome do local
        }
        
    });

    console.log("📏 Distância total:", resultado.distancia);
} */

function desenharRota(resultado, pontos){
    for(let i = 0; i < resultado.rota.length - 1; i++){
        const indiceOrigem = resultado.rota[i];
        const indiceDestino = resultado.rota[i + 1];

        const origem = pontos[indiceOrigem];
        const destino = pontos[indiceDestino];

        const dx = destino.x - origem.x;
        const dy = destino.y - origem.y;

        const distancia = Math.sqrt(dx * dx + dy * dy);

        const angulo = Math.atan2(dy, dx) * 180 / Math.PI;
        //Math.atan2 retorna o angulo entre as coordenadas informadas

        const linha = document.createElement("div");

        linha.classList.add("linha-rota");

        linha.style.left = `${origem.x}px`;
        linha.style.top = `${origem.y}px`;
        linha.style.width = `${distancia}px`;

        linha.style.transform = `rotate(${angulo}deg)`;

        estoque.appendChild(linha);

        /*
        console.log(
            "Desenhando: ",
            origem.produto,
            "→",
            destino.produto
        );
         */
    }
}

const pontosDaRota = criarPontosDaRota(pedido);
/* 
console.log("Pontos da Rota:");
console.table(pontosDaRota);// ajudar a visualizar como uma tabela os pontos da rota do pedido
 */
const matriz = criarMatrizDeDistancias(pontosDaRota);

const rotas =  gerarRotas(pontosDaRota);

const resultado = encontrarMelhorRota(rotas, matriz);

//mostrarMelhorRota(resultado, pontosDaRota);

desenharRota(resultado, pontosDaRota);
/* 
console.log("🏆 Melhor rota:", resultado.rota);
console.log("📏 Menor distância:", resultado.distancia);
 */
/*
console.log("Rotas possíveis: ");
console.log(rotas);
*/
/*
const rota1 = [0, 1, 2];
const rota2 = [0, 2, 1];

console.log("Rota 1:", calcularDistanciaDaRota(rota1, matriz));
console.log("Rota 2:", calcularDistanciaDaRota(rota2, matriz));
*/
/*
console.log("Matriz de distâncias:");
console.log(matriz);

const distancia = calcularDistancia(
    pontosDaRota[0],
    pontosDaRota[1]
);

console.log("Distância: ", distancia);
*/
/*
console.log(precisaEmpilhadeira(produtos[0], posicoes[0]));
console.log(precisaEmpilhadeira(produtos[1], posicoes[1]));
console.log(precisaEmpilhadeira(produtos[2], posicoes[2]));
*/

/*
const produto = produtos[2];

const posicao = encontrarPosicaoDoProduto(produto);

console.log(produto);
console.log(posicao);
*/

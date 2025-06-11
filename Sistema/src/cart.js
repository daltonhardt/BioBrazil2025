// label é a parte de cima da página do carrinho
let label = document.getElementById("label");

// shoppingCart é o corpo da página do carrinho com todos os produtos escolhidos
let shoppingCart = document.getElementById("shopping-cart")

//console.log('shopItemsData', shopItemsData);

// lendo as quantidades da localStorage no caso de um refresh de página
// se o carrinho estiver vazio inicializa com um array vazio
let basket = JSON.parse(localStorage.getItem("data")) || [];

// lendo o inventario da localStorage
let Inventario = JSON.parse(localStorage.getItem("inventario"));

// busca da memória o tipo de venda (0, 1, 2, 3, 4 ou 5)
let tipo = localStorage.getItem("tipoVenda");

// formatação moeda em REAL
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

// pegando data e hora para usar no nome do arquivo de venda
var Data = new Date().toLocaleDateString();
var Hora = new Date().toLocaleTimeString();
var newDate = new Date().toLocaleDateString().replace(/\//g, '-');
var newTime = new Date().toLocaleTimeString().replace(/\:/g, '-');
//var ticket = new Date().toLocaleDateString().replace(/\//g, '') + new Date().toLocaleTimeString().replace(/\:/g, '');
var ticket = new Date().valueOf();
localStorage.setItem("ticket", ticket);
//console.log("ticket: ", ticket);
var dataHora = newDate + '-' + newTime;
//console.log("dataHora: ", dataHora);

let calculation =() => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((y, z) => y+z, 0);
};
calculation();

// função para gerar os itens no carrinho depois de ter escolhido na Loja
let generateCartItems = () => {
    if (basket.length !== 0) {
        //console.log("O carrinho não está vazio");
        return shoppingCart.innerHTML = basket.map((x) => {
            //console.log('Cart mapeando x', x);
            let { id, item, descontoItem } = x;
            let search = shopItemsData.find((y) => y.id === id) || []; 
            let { img, name, price, maxItemDiscount} = search;
            //console.log('SEARCH:', search);
            //console.log('Cart ID:', id);
            let valorItem = formatter.format(price[tipo]);
            let valorItemTotal = formatter.format(item * price[tipo] * (1 - descontoItem/100));
            // console.log('maximo desconto:', maximoDesconto);
            return `
            <div class="cart-item">
                <img width="160" height="160" src=${img} alt="" />
                <div class="details">
                    <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${name}</p>
                            <p class="cart-item-price">${valorItem}</p>
                        </h4>
                        <i onclick="removeItem(${id})" class="bi bi-trash"></i>
                    </div>

                    <div class="plus-minus-buttons">Qtde.
                        <i onclick="decrement(${id}, ${maxItemDiscount})" class="bi bi-dash-lg"></i>
                            <div id=${id} class="quantity">${item}</div>
                        <i onclick="increment(${id}, ${maxItemDiscount})" class="bi bi-plus-lg"></i>
                    </div>

                    <h2>${valorItemTotal}</h2>

                    <div class="plus-minus-buttons">Desc.:
                        <i onclick="decrementDiscountItem(${id})" class="bi bi-dash-lg"></i>
                            <div >${descontoItem}</div>
                        <i onclick="incrementDiscountItem(${id}, ${maxItemDiscount})" class="bi bi-plus-lg"></i>
                    </div>

                </div>
            </div>
            `;
        }).join("");
    }
    else {
        //console.log("O carrinho está Vazio");
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
        <h2>Carrinho está Vazio</h2>
        <a href="index.html">
            <button class="HomeBtn">Voltar para Início</button>
        </a>
        `;
    }
};
generateCartItems();  // chamando/rodando a função criada acima

// função para aumentar o desconto do item (sinal de mais)
let increment = (id, maxItemDiscount)=>{
    //console.log('Cart increment ID:', id);
    //console.log('Cart increment max Item Disc.:', maxItemDiscount);
    let selectedItem = id;
    //console.log("incrementCart", selectedItem.id);
    
    let search = basket.find((x)=> x.id === selectedItem.id);
    //console.log('search:', search);
    
    if (search === undefined) {
        basket.push({ 
            id: selectedItem.id,
            item: 1,
            maxDesconto: maxItemDiscount,
            descontoItem: 0
        });
    } else {
        search.item += 1;
    }
    
    // gerando novamente os itens no carrinho 
    generateCartItems();
    
    // console.log(basket);
    update(selectedItem.id);

    // salvando as quantidades na localStorage para não perder com refresh
    localStorage.setItem("data", JSON.stringify(basket));
};

// função para diminuir a quantidade do item (sinal de menos)
let decrement = (id)=>{
    let selectedItem = id;
    //console.log("decrementCart", selectedItem.id);
    let search = basket.find((x)=> x.id === selectedItem.id);

    if (search === undefined) return;  // cai fora se a basket está vazia
    else if (search.item === 0) return;
    else {
        search.item -= 1;
    }

    // chamando a função para atualizar o produto
    update(selectedItem.id);
    
    // filtrando o basket para deixar somente os items com quantidade (> 0)
    basket = basket.filter((x) => x.item != 0);

    // gerando novamente os itens no carrinho para quando a 
    // quantidade = 0 o quadro do item é removido da tela
    generateCartItems();

    // salvando as quantidades na localStorage para não perder com refresh
    localStorage.setItem("data", JSON.stringify(basket));
};

// função para aumentar o desconto do item (sinal de mais)
let incrementDiscountItem = (id, maxItemDiscount)=>{
    let selectedItem = id;
    //console.log("incrementDiscountItem", selectedItem.id);
    //console.log("maximo desconto desse item", maxItemDiscount);
    let search = basket.find((x)=> x.id === selectedItem.id);
    //console.log('increment discount item search', search);

    if (search === undefined) return;
    else if (search.descontoItem >= maxItemDiscount) return;
    else {
        //console.log('colocando desconto...');
        search.descontoItem += 1;
        //console.log('desconto no item:', search.descontoItem);
    };
    //console.log(basket);
    // gerando novamente os itens no carrinho 
    generateCartItems();
    // chamando a função para atualizar o produto
    update(selectedItem.id);
    // salvando as quantidades na localStorage para não perder com refresh da página
    localStorage.setItem("data", JSON.stringify(basket));
};

// função para diminuir o desconto do item (sinal de menos)
let decrementDiscountItem = (id)=>{
    let selectedItem = id;
    //console.log("decrementDiscountItem", selectedItem.id);
    let search = basket.find((x)=> x.id === selectedItem.id);

    if (search === undefined) return;  // cai fora se a cesta está vazia
    else if (search.descontoItem === 0) return;  //cai fora se a quantidade ZERO de produto
    else {
        search.descontoItem -= 1;  // diminui 1 na quantidade
        //console.log('desconto no item:', search.descontoItem);
    }
    //console.log(basket);
    // chamando a função para atualizar o produto
    update(selectedItem.id);
    // gerando novamente os itens no carrinho 
    generateCartItems();
    // salvando as quantidades na localStorage para não perder com refresh da página
    localStorage.setItem("data", JSON.stringify(basket));
};

// função para atualizar a tela com os valores ao aumentar/diminuir as quantidades dos itens na cesta
let update = (id)=>{
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    totalAmount();
};

// função para remover o item da cesta (icone da lixeira ao lado de cada item)
let removeItem = (id) => {
    if (confirm('Quer realmente eliminar este item?')) {
        let selectedItem = id;
        // console.log(selectedItem.id);
        basket = basket.filter((x) => x.id !== selectedItem.id);
        // gerando novamente os itens no carrinho para quando a 
        // quantidade = 0 o quadro do item é removido da tela
        generateCartItems();
        // atualiza a quantidade total da compra
        totalAmount();
        // atualiza o contador de itens comprados
        calculation();
        // salvando as quantidades na localStorage para não perder com refresh
        localStorage.setItem("data", JSON.stringify(basket));
    };
};

// função para definir as variáveis da forma de pagamento
let formaPago = (forma, descontoPix) => {
    let formaPgto = forma;
    // let descontoFinal = descontoPix;
    localStorage.setItem("formaPgto", formaPgto);
    // localStorage.setItem("descontoFinal", descontoFinal);
    
    let venda = localStorage.getItem("tipoDeVenda");
    // if (venda != 'ESPECIALISTA' && venda != 'LOJISTA') {
    //     localStorage.setItem("descontoFinal", 0);
    //     let descontoFinal = localStorage.getItem("descontoFinal");
    //     console.log('descontoFinal formaPago:', descontoFinal);
    // };
    // localStorage.setItem("background-color", "darkslategray");
    // localStorage.setItem("font-weight", "600");
    // localStorage.setItem("box-shadow", "0 0 0 3px black");
    totalAmount();
};

// função para limpar o carrinho
let clearCart = () => {
    if (confirm('Confirma limpar o carrinho?')) {
        // zera o conteúdo da cesta
        //console.log('Clear Cart basket', basket);
        basket = [];
        generateCartItems();
        // atualiza o contador de itens comprados
        calculation();
        // salva as quantidades na localStorage para atualizar os valores
        localStorage.setItem("data", JSON.stringify(basket));
        localStorage.clear();
    };
};

// Função para finalização da compra (fazer o checkout)
let checkout = () => {
    if (basket.length !== 0) {
        let formaPgto = localStorage.getItem("formaPgto");
        let totalCompra = localStorage.getItem("totalCompra");
        let totalCompraDisplay = formatter.format(localStorage.getItem("totalCompra"));
        if (formaPgto == undefined) {
            alert("Selecione o modo de Pagamento!");
        } else {
            let valorCobrado = prompt("Confirme o valor a ser cobrado de " + totalCompraDisplay + " ou altere abaixo:", totalCompra);
            console.log('valorCobrado =', valorCobrado);
            if (valorCobrado > 0) {
                localStorage.setItem("valorCobrado", valorCobrado);
            } else {
                localStorage.setItem("valorCobrado", totalCompra);
            };
            let valorCobradoDisplay = formatter.format(localStorage.getItem("valorCobrado"));
            if (confirm('Finalizar a compra no ' + formaPgto + ' no valor final de ' + valorCobradoDisplay + ' ?')) {
                //console.log("====Salvando o conteúdo da cesta em arquivo externo..");
                let venda = localStorage.getItem("tipoDeVenda");
                //console.log("Tipo de venda:", venda);
                let regFinal = [];
                basket.map((x) => {
                    // console.log('x=', x);
                    let { id, item, descontoItem } = x;
                    let search = shopItemsData.find((x) => x.id === id) || []; 
                    let { name, price} = search;
                    let valorItem = price[tipo];
                    let descontoFinal = 0;
                    descontoPix = localStorage.getItem("descontoPix");
                    if (formaPgto == 'PIX/Dinheiro') {
                        descontoFinal = localStorage.getItem("descontoPix");
                        localStorage.setItem("descontoFinal", descontoFinal)
                    } else {
                        descontoFinal = 0;
                        localStorage.setItem("descontoFinal", descontoFinal)
                    };
                    console.log('descontoFinal: ', descontoFinal);
                    let totalCompra = localStorage.getItem("totalCompra");
                    let valorTotalItem = (item * search.price[tipo]);
                    let valorFinalItem = (item * search.price[tipo]) * (1-descontoItem/100) * ( 1-descontoFinal/100);
                    // TICKET,DATA,HORA,TIPO-VENDA,FORMA-PAGO,CODIGO,PRODUTO,QTDE,VALOR-ITEM,TOTAL-ITEM,DESCONTO,TOTAL,TOTAL-COMPRA,VALOR-COBRADO
                    let reg = ticket + ',' +
                            Data + ',' +
                            Hora + ',' + 
                            venda + ',' + 
                            formaPgto + ',' + 
                            id + ',' + 
                            name + ',' + 
                            item + ',' + 
                            valorItem.toFixed(2) + ',' + 
                            valorTotalItem.toFixed(2) + ',' +
                            descontoFinal + ',' + 
                            valorFinalItem.toFixed(2) + ',' +
                            (totalCompra*1).toFixed(2) + ',' +
                            (valorCobrado*1).toFixed(2);
                    console.log(reg);
                    regFinal += reg + '\n';
                }).join("");
                //console.log('registro final:\n', regFinal)

                var blob = new Blob([regFinal], { type: "text/plain;charset=utf-8" });
                var nome_arq = dataHora + '-venda-feira.dat';
                saveAs(blob, nome_arq);

                // chamando a função para Atualizar o Inventario
                atualizaInventario();
                
                // chama a função para limpar o carrinho
                clearCart();
            };
        };
    };
};

// Função para calcular o total da compra
let totalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let {item, id, descontoItem } = x;
            let search = shopItemsData.find((y) => y.id === id) || [];
            let valorFinalItem = (item * search.price[tipo]) * (1- descontoItem/100) ;
            //console.log('valor final do Item', valorFinalItem);
            return valorFinalItem;
        }).reduce((x,y) => x+y, 0);
    
        let formaPgto = localStorage.getItem("formaPgto");
        descontoPix = localStorage.getItem("descontoPix");
        if (formaPgto == 'PIX/Dinheiro') {
            amount = amount * (1-descontoPix/100);
        };

        if (tipo == 0) {
            localStorage.setItem("tipoDeVenda", 'CONSUMIDOR FINAL');
        } else if (tipo == 1) {
            localStorage.setItem("tipoDeVenda", 'ESPECIALISTA');
        } else if (tipo == 2) {
            localStorage.setItem("tipoDeVenda", 'LOJISTA');
        } else if (tipo == 3) {
            localStorage.setItem("tipoDeVenda", 'AQUARELA');
        } else if (tipo == 4) {
            localStorage.setItem("tipoDeVenda", 'MARKETPLACE');
        } else if (tipo == 5) {
            localStorage.setItem("tipoDeVenda", 'BRINDE');
        };
        let venda = localStorage.getItem("tipoDeVenda");
        
        let total = formatter.format(amount);
        //console.log("Total da compra:", total);
        localStorage.setItem("totalCompra", amount.toFixed(2));
        label.innerHTML = `
        <h1>Total no ${formaPgto}:  ${total}</h1>
        <h3 class="tipo-de-venda">⚠️ ${venda} </h3><br>
        <button onclick="formaPago('Cartao', 0)" class="pagoCartao">💳 CARTÃO</button>
        <button onclick="formaPago('PIX/Dinheiro', 0)" class="pagoPIX">💵 PIX/Dinheiro</button>
        <button onclick="checkout()" class="checkout">Finalizar Compra ✅</button><br><br><br>
        <a href="loja.html"><button class="continuarComprando">Continuar Comprando</button></a>
        <button onclick="clearCart()" class="removeAll">Limpar Carrinho</button><br>
        `
    } else return
}; 
totalAmount();   // roda a função criada acima

// Função para atualizar o inventario
let atualizaInventario = () => {
    console.log("Atualizando o inventario...");
    basket.map((x) => {
        // console.log('map x=', x);
        let { id, item } = x;
        console.log('id=', id);
        console.log('item=', item);
        let search = shopItemsData.find((x) => x.id === id) || []; 
        console.log('search=', search);
        let { itemStock } = search;
        console.log('productStock=', itemStock);
        let estoqueAtualizado = itemStock - item;
        console.log('estoqueAtualizado=', estoqueAtualizado);
        let busca = Inventario.find((z) => z.id === id);
        busca.itemStock = estoqueAtualizado;
        console.log('busca=', busca);
        localStorage.setItem("inventario", JSON.stringify(Inventario));
        console.log('Inventario=', Inventario)
    });
};
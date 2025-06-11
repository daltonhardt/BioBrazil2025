# Programa gerador da Lista de Dados da Feira
# Função: gerar o arquivo com a lista de produtos para carregar na Loja
# Input: o programa varre o diretório com as imagens dos produtos
# Output: arquivo de saida com: ID;Imagem;Produto;Valor;Desconto;Estoque
# Autor:  Dalton Hardt   Jun/2025

import os

# diretorio de pesquisa das imagens
diretorio = '/Users/dalton/Desktop/workspace/code/HERBIA/2025/Feira/Images/'
# diretorio = '/Users/dalton/Desktop/BioBrazil2025/Sistema/Images/'

# arquivo de saida
f = open('DadosFeira.dat', 'a')
header = 'CODIGO;IMAGEM;PRODUTO;VALOR;DESCONTO;QTDE'
f.write(header + '\n')

# lista todos os sub-diretorios e seus arquivos
lista_diretorios = [f for f in os.listdir(diretorio) if os.path.isdir(os.path.join(diretorio, f))]
print('Total de', len(lista_diretorios), 'diretorios', lista_diretorios)

total = 0
seq = 0
for item in lista_diretorios:
    if not item.startswith('.'):  # ignora o arquivo .DS_Store gerado no Mac
        print('==> [', item, ']')
        path = diretorio + '/' + item
        arq = sorted(os.listdir(path))  # gera uma lista com o arquivos do diretorio lido
        qtd = 0
        for i in range(0, len(arq)):
            if not arq[i].startswith('.'):  # ignora o arquivo .DS_Store gerado no Mac
                total += 1
                qtd += 1
                seq += 1
                # renomeando arquivo trocando espaço em branco por hifen
                if os.path.basename(arq[i]).count(" ") != 0:
                    old_name = diretorio + item + '/' + arq[i]
                    new_name = diretorio + item + '/' + arq[i].replace(" ", "-")
                    print('Nome antigo:', old_name, '....... Novo nome:', new_name)
                    os.rename(old_name, new_name)
                print(str(qtd), arq[i])
                # definindo o registro para escrever no arquivo
                numero = 'P' + str(seq).zfill(2)
                produto = arq[i][:-4].replace("-", " ")
                valor = '[5, 4, 3, 2, 1, 0]'
                desconto = '0'
                estoque = '1'
                registro = numero + ';' + './Images/' + item + '/' + arq[i].replace(" ", "-") + ';' + produto + ';' + valor + ';' + desconto + ';'+ estoque
                f.write(registro + '\n')

print('Total de arquivos:', total)
f.close()

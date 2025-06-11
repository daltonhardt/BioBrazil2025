# Programa gerador de dados em JavaScript
# Função: gerar o arquivo de dados que é usado no sistema de Vendas
# Input: arquivo tipo .txt que contém os produtos que serão vendidos incluindo:
#        ID,Imagem,Produto,Valor,Desconto,Estoque
# Output: arquivo tipo .js com a instrução em formato javaScript
# Autor:  Dalton Hardt   Mar-2024

# diretorio de pesquisa
diretorio = '/Users/dalton/Desktop/BioBrazil2025/Sistema/Images'

# abrindo o arquivo de Entrada
fileInput = open('/Users/dalton/Desktop/BioBrazil2025/Sistema/DadosFeira.dat', 'r')

# criando o arquivo de Saida
fileOutput = open('/Users/dalton/Desktop/BioBrazil2025/Sistema/src/data.js', 'w')

# gravando a primeira linha
fileOutput.write('let shopItemsData = [' + '\n')

# gravando as demais linhas lendo do arquivo de entrada
Lines = fileInput.readlines()
i = 0
for line in Lines:
    if i == 0:  # excluindo o header na primeira linha
        i += 1
        continue
    else:
        reg = line.split(";")
        # print('reg: ', reg)
        # print('length: ', len(reg))
        registro = '\t{\n' + '\t\tid: "' + reg[0] + '",\n' + '\t\tname: "' + reg[2] + '",\n' + '\t\tprice: ' + reg[3] + \
                    ',\n' + '\t\tmaxItemDiscount: ' + reg[4] + ',\n' + \
                    '\t\titemStock: ' + reg[5][:-1] + ',\n' + '\t\timg: "' + reg[1].replace(" ", "-") + '" \n\t},\n'
        # print(registro)
        fileOutput.write(registro)

fileOutput.write('];\n')
fileInput.close()
fileOutput.close()

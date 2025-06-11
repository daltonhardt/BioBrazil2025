import os
import shutil
import time
from datetime import datetime
from pathlib import Path
import pandas as pd

# --------------------  DEFINIÇÕES GERAIS  --------------------
# PASTA DE ENTRADA DO ARQUIVO DE VENDAS
dir_entrada_venda = str(Path.home()) + '/Downloads'

# DIRETORIO DO SISTEMA
dir_sistema = str(Path.home()) + '/Desktop/BioBrazil2025/Sistema'

# DIRETORIO DO ARQUIVO DE VENDAS
dir_vendas = str(Path.home()) + '/Desktop/BioBrazil2025'

# ARQUIVO QUE VAI CONTER OS DADOS DAS VENDAS
arq_venda_total = dir_vendas + '/TotalVendasFeira.csv'

# PASTA PARA ONDE SERÃO REMOVIDOS OS ARQUIVOS PROCESSADOS
dir_processado = dir_vendas + '/VendaProcessada/'
# Criando a pasta se ainda não existe
Path(dir_processado).mkdir(parents=True, exist_ok=True)

# PASTA DE ENTRADA DO ARQUIVO DE VENDAS
arq_dados_master = dir_sistema + '/DadosFeira.dat'
arq_java_data = dir_sistema + '/src/data.js'

gerador_java_data_file = dir_sistema + '/geradorDadosJavaScript.py'

# COLUNAS QUE SERÃO GRAVADAS NO ARQUIVO
colunas_venda = ['TICKET', 'DATA', 'HORA', 'TIPO-VENDA', 'FORMA-PAGO', 'CODIGO', 'PRODUTO', 'QTDE', 'VALOR-ITEM',
                 'TOTAL-ITEM', 'DESCONTO', 'TOTAL', 'TOTAL-COMPRA', 'VALOR-COBRADO']

pd.set_option('display.max_rows', None)


# -------------- PROCESSAMENTO DO ARQUIVO DE VENDA --------------
def processaVenda(arq_venda):
    # DEFININDO VARIAVEIS GLOBAIS
    # global arq_venda, arq_venda_total

    print('[INFO]', datetime.now().strftime('%H:%M:%S'), 'extraindo os dados da venda...')
    with open(arq_venda[0], 'r') as file1:
        with open(arq_venda_total, 'a') as file2:
            shutil.copyfileobj(file1, file2)

    print('[INFO]', datetime.now().strftime('%H:%M:%S'), 'atualizando inventario...')
    # print('lendo arquivo de venda:', arq_venda[0])
    df_venda = pd.read_csv(arq_venda[0], header=None)
    df_venda.columns = colunas_venda
    # print('df_venda total:\n', df_venda)
    # filtrando somente  as colunas CODIGO e QTDE do arquivo da venda
    df_venda = df_venda[['CODIGO', 'QTDE']]
    # print('df_venda reduzido:\n', df_venda)
    df_venda = df_venda.reset_index()  # make sure indexes pair with number of rows
    # for index, row in df_venda.iterrows():
    #    print(index, 'atualiza registro no data.js com CODIGO=', row['CODIGO'], 'e QTDE=', row['QTDE'])
    # print('abrindo arquivo de dados com inventario...')
    df_dados_master = pd.read_csv(arq_dados_master, sep=';')
    # print('df_dados_master:\n', df_dados_master)

    # cria um novo dataframe com somente os registros que foram alterados com a venda
    df_update = pd.merge(df_venda, df_dados_master, on='CODIGO', suffixes=('_sales', '_master'))
    # print('df_update depois do MERGE:\n', df_update)

    # subtraindo a quantidade vendida
    df_update['QTDE_master'] -= df_update['QTDE_sales']

    # renomeando a coluna da quantidade atualizada de volta para 'QTDE'
    df_update.rename(columns={'QTDE_master': 'QTDE'}, inplace=True)
    # print('df_update com inventario novo:\n', df_update)

    # ficando somente com as duas colunas que interessam
    df_update = df_update[['CODIGO', 'QTDE']]
    # print('df_update somente com duas colunas que interessam:\n', df_update)

    # setando a coluna CODIGO como indice para os dois dataframes
    df_update.set_index('CODIGO', inplace=True)
    df_dados_master.set_index('CODIGO', inplace=True)

    # atualizando os dados do master com o dataframe de update
    df_dados_master.update(df_update)
    # Reset the index if you want to save the file without an index
    df_dados_master.reset_index(inplace=True)
    # print('df_dados_master atualizados:\n', df_dados_master)

    # salvando o dataframe como arq_dados_master = 'DadosFeira2024.dat'
    df_dados_master.to_csv(arq_dados_master, sep=';', index=False)
    print('[INFO]', datetime.now().strftime('%H:%M:%S'),
          'Arquivo DadosFeira.dat com inventário atualizado com sucesso!')

    print('[INFO]', datetime.now().strftime('%H:%M:%S'), 'Movendo arquivo de venda processado...')
    shutil.move(arq_venda[0], dir_processado)

    # rodando o arquivo gerados de dados em javascript
    print('[INFO]', datetime.now().strftime('%H:%M:%S'), 'Gerando novo arquivo de dados em JavaScript...')
    time.sleep(3)
    comando = 'python ' + dir_sistema + '/geradorDadosJavaScript.py'
    os.system(comando)

    print('[INFO]', datetime.now().strftime('%H:%M:%S'), '- FIM -')


def main():
    # DEFININDO VARIAVEIS GLOBAIS
    # global arq_venda, arq_venda_total

    # LISTANDO ARQUIVO VENDA PARA PROCESSAR
    # print('---> Buscando arquivo...')
    # arq_venda = [f for f in sorted(os.listdir(dir_entrada_venda)) if f.endswith('venda-feira2024.dat')]
    arq_venda = [os.path.join(dir_entrada_venda, f) for f in sorted(os.listdir(dir_entrada_venda)) if
                 f.endswith('venda-feira.dat')]
    # yield os.path.abspath(os.path.join(dir_entrada_venda, arq_venda))
    # print('---> Arquivo encontrado: ', arq_venda)

    if len(arq_venda) > 0:
        # CHAMA FUNÇÃO PARA PROCESSAR O ARQUIVO TIPO DAT PARA EXTRAIR OS DADOS E CRIAR O DATAFRAME
        # print('--->', datetime.now().strftime('%H:%M:%S'), 'chamando a função...')
        processaVenda(arq_venda)

    else:
        print('\nNenhum arquivo de encontrado na pasta', dir_entrada_venda)


if __name__ == '__main__':
    main()

import time
import os
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# --------------------  DEFINIÇÕES GERAIS  --------------------
# DIA DE HOJE NO FORMATO dd-mm-aaaa
today = datetime.now()
hoje = today.strftime('%d-%m-%Y')
hora = today.strftime('%H:%M:%S')

# DIAS DA SEMANA EM PORTUGUES
dias_semana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']
wkday = today.weekday()

# MENSAGEM DE SAUDAÇÃO
print('------------------------------------------------')
print('|                                              |')
print('|      MONITORAMENTO DE VENDAS NA FEIRA        |')
print('|                                              |')
print('------------------------------------------------\n')
print('[INFO]', dias_semana[wkday], hoje)

# DIRECTORY_TO_WATCH = '/Users/fernandavollrath/Downloads/'
# PROGRAMA_LEITURA_VENDA = '/Users/fernandavollrath/Desktop/BioBrazil2025/Sistema/leituraVenda_base.py'
# dir_vendas = '/Users/fernandavollrath/Downloads/'
# arq_venda_total = '/Users/fernandavollrath/Desktop/BioBrazil2025/TotalVendasFeira.csv'
DIRECTORY_TO_WATCH = '/Users/dalton/Downloads/'
PROGRAMA_LEITURA_VENDA = '/Users/dalton/Desktop/BioBrazil2025/Sistema/leituraVenda.py'
dir_vendas = '/Users/dalton/Downloads/'
arq_venda_total = '/Users/dalton/Desktop/BioBrazil2025/TotalVendasFeira.csv'

# -------------- PROCESSAMENTO DOS ARQUIVOS DE VENDAS --------------

class Watcher:
    WATCH_DIRECTORY = DIRECTORY_TO_WATCH
    print('[INFO]', datetime.now().strftime('%H:%M:%S'), f'início monitoramento em {DIRECTORY_TO_WATCH}')

    def __init__(self):
        self.observer = Observer()

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.WATCH_DIRECTORY, recursive=False)
        self.observer.start()
        try:
            while True:
                time.sleep(3)
        except KeyboardInterrupt:
            self.observer.stop()
            print('\n[INFO]', datetime.now().strftime('%H:%M:%S'), 'processo finalizado!\n')

        self.observer.join()


class Handler(FileSystemEventHandler):

    @staticmethod
    def on_any_event(event, *args):
        if event.is_directory:
            return None

        elif event.event_type == 'created':
            if event.src_path[-15:].lower() == 'venda-feira.dat':
                print('\n---------------')
                print('[INFO]', datetime.now().strftime('%H:%M:%S'), 'entrou: %s' % event.src_path)
                # RODA O PROGRAMA QUE COPIA OS DADOS DA VENDA
                print('[INFO]', datetime.now().strftime('%H:%M:%S'), 'processando a venda...')
                os.system(f'python {PROGRAMA_LEITURA_VENDA}')
                time.sleep(3)
        '''
        elif event.event_type == 'modified':
            if event.src_path[-3:] == 'xml':
                print(datetime.now().strftime('%d/%m/%Y %H:%M:%S'), '| Modificado arquivo: %s' % event.src_path)

        elif event.event_type == 'deleted':
            if event.src_path[-3:] == 'xml':
                print(datetime.now().strftime('%d/%m/%Y %H:%M:%S'), '| Saiu arquivo: %s' % event.src_path)

        elif event.event_type == 'moved':
            if event.src_path[-3:] == 'xml':
                print(datetime.now().strftime('%d/%m/%Y %H:%M:%S'), '| Movido arquivo: %s' % event.src_path)
        '''


if __name__ == '__main__':
    w = Watcher()
    w.run()

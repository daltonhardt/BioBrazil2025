#!/bin/bash

# Define o caminho completo para o seu script Python
PYTHON_SCRIPT="/Users/dalton/Desktop/BioBrazil2025/Sistema/watchdogVenda.py"

# Define o caminho completo para o seu arquivo HTML
HTML_FILE=/Users/dalton/Desktop/BioBrazil2025/Sistema/index.html

# 1. Abre uma nova janela do Terminal para executar o script Python
# O '&' ao final do 'do script' executa o script em segundo plano dentro da nova janela do Terminal
osascript -e 'tell application "Terminal" to do script "python \"'"$PYTHON_SCRIPT"'\""' &

# Pequena pausa para garantir que o script Python inicie, se necessário
sleep 2

# 2. Abre o arquivo HTML depois que o script Python terminar
echo "Abrindo o arquivo HTML: $HTML_FILE"
open "$HTML_FILE"

# 3. Feche a janela atual do Terminal (a janela que executou este script de shell).
# Este comando AppleScript é executado pela janela atual.
echo "Fechando esta janela do Terminal..."
#osascript -e 'tell application "Terminal" to close (first window whose name contains (system attribute "TERM_PROGRAM_VERSION") and name does not contain "zsh" and name does not contain "bash")'
osascript -e 'tell application "Terminal" to close (second window whose name contains "dalton")'
# OU uma abordagem mais simples que fecha a aba atual:
# osascript -e 'tell application "Terminal" to close (first tab of front window)'

#echo "Processo concluído. Pressione qualquer tecla para fechar a janela do Terminal."
## shellcheck disable=SC2162
#read -n 1 -s # Espera por uma tecla para manter a janela aberta

exit 0

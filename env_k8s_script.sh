#!/bin/bash

# Verifica se o número de argumentos é válido
if [ "$#" -ne 1 ]; then
  echo "Uso: $0 <on/off>"
  exit 1
fi

# Obtém o valor do parâmetro "state"
state=$1

# Verifica o valor do parâmetro e executa os comandos correspondentes
if [ "$state" == "on" ]; then
  kubectl apply -f kubernetes/app-ms-producao-pod.yml
  kubectl apply -f kubernetes/db-ms-producao-pod.yml
  kubectl apply -f kubernetes/db_secrets.yml
  kubectl apply -f kubernetes/svc-app.yml
  kubectl apply -f kubernetes/svc-db.yml
  echo "[OK] Running Pods on http://localhost:30003/"
elif [ "$state" == "off" ]; then
  kubectl delete -f kubernetes/app-ms-producao-pod.yml
  kubectl delete -f kubernetes/db-ms-producao-pod.yml
  kubectl delete -f kubernetes/db_secrets.yml
  kubectl delete -f kubernetes/svc-app.yml
  kubectl delete -f kubernetes/svc-db.yml
else
  echo "Valor inválido para o parâmetro 'state'. Use 'on' ou 'off'."
  exit 1
fi

exit 0
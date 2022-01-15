#!/bin/bash
touch src/scss/blocks/$1.scss

echo -e "@use 'blocks/$1';" >> src/scss/style.scss
echo -e ".$1" >> src/sсss/blocks/"$1".scss

echo "Блок $1 создан"

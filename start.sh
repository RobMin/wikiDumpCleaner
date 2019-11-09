#!/bin/bash

# $1 - input file
# $2 - home many 10mb files to take
# $3 - output file

mkdir dump
sudo split --suffix-length=4 --bytes=10M --numeric-suffixes --verbose $1 ./dump/

node createCleanRandomSet.js $2

mkdir dump3
cat ./dump2/* > ./dump3/clean.xml 

node index.js ./dump3/clean.xml $3

rm -rf dump
rm -rf dump2
rm -rf dump3

echo done

#!/bin/bash

# 
# Mach1
# Download audio files for web examples
# 

if [[ $PWD/ = */m1-web-spatialaudioplayer/* ]]
then 
	echo $PWD
else
	echo "You are in the wrong directory!"
	echo $PWD
	exit
fi

mkdir -p audio/m1spatial

cd ../m1spatial
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T1.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T2.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T3.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T4.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B5.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B6.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B7.ogg
wget http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B8.ogg
REM
REM Mach1
REM Download audio files for web examples
REM

cd %~dp0
mkdir audio\m1spatial

cd ..\m1spatial
powershell -Command "Invoke-WebRequest -OutFile T1.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T1.ogg"
powershell -Command "Invoke-WebRequest -OutFile T2.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T2.ogg"
powershell -Command "Invoke-WebRequest -OutFile T3.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T3.ogg"
powershell -Command "Invoke-WebRequest -OutFile T4.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/T4.ogg"
powershell -Command "Invoke-WebRequest -OutFile B1.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B5.ogg"
powershell -Command "Invoke-WebRequest -OutFile B2.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B6.ogg"
powershell -Command "Invoke-WebRequest -OutFile B3.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B7.ogg"
powershell -Command "Invoke-WebRequest -OutFile B4.ogg http://dev.mach1.xyz/mach1-sdk-sample-audio/web/m1spatial/B8.ogg"

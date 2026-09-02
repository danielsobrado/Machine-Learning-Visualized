@echo off
setlocal

pushd "%~dp0\.."
if errorlevel 1 exit /b 1

node scripts\deploy-github-pages.mjs
set "exitCode=%errorlevel%"

popd
exit /b %exitCode%
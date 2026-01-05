@echo off
echo Stopping all Beckn Travel Discovery services...
echo.

echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo All services stopped.
pause
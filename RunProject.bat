@echo off
title Academic Central University Launcher
echo Starting Academic Central University Project...

:: Start the ASP.NET Core Backend in a new window
echo Starting ASP.NET Backend...
start "Backend API" cmd /k "cd Backend API && dotnet run"

:: Start the React Frontend in a new window
echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm start"

echo Both servers are starting up! You can minimize these windows.
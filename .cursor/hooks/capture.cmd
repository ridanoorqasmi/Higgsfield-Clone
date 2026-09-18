@echo off
setlocal
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
set PY=C:\Users\Rida Noor\AppData\Local\Python\pythoncore-3.14-64\python.exe
if not exist "%PY%" (
  where py >nul 2>nul && (
    py -3 -u "%~dp0capture.py"
    exit /b %ERRORLEVEL%
  )
  python -u "%~dp0capture.py"
  exit /b %ERRORLEVEL%
)
"%PY%" -u "%~dp0capture.py"
exit /b %ERRORLEVEL%

@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 실습 문법표 로컬 서버 시작 (http://127.0.0.1:8888)
echo 브라우저에서 index.html 을 열거나 아래 주소로 접속하세요.
echo.
python -m http.server 8888 --bind 127.0.0.1
pause

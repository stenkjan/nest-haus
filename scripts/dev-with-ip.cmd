@echo off
REM Get local IP and start Next.js dev server
for /f %%i in ('node scripts/get-local-ip.js') do set LOCAL_IP=%%i
echo Starting dev server on %LOCAL_IP%:3000
next dev --hostname %LOCAL_IP%

#!/bin/bash

echo "🚀 Heroku 배포 시작"
echo "===================="

APP_NAME="oicrcutieportfolio"

if [ ! -d .git ]; then
    echo "📦 Git 저장소 초기화..."
    git init
    git add .
    git commit -m "Initial commit"
fi

if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI가 설치되어 있지 않습니다."
    echo "설치: brew install heroku/brew/heroku"
    exit 1
fi

echo "🔐 Heroku 로그인 확인..."
heroku auth:whoami

echo "🏗️  Heroku 앱 생성..."
heroku create $APP_NAME 2>/dev/null || echo "앱이 이미 존재합니다."

echo "🗄️  PostgreSQL 추가..."
heroku addons:create heroku-postgresql:mini -a $APP_NAME 2>/dev/null || echo "PostgreSQL이 이미 설정되어 있습니다."

echo "⚙️  환경변수 설정..."
heroku config:set ADMIN_USERNAME=oicrcutie -a $APP_NAME
heroku config:set ADMIN_PASSWORD=aa667788!! -a $APP_NAME
heroku config:set GMAIL_USERNAME=oicrcutie@gmail.com -a $APP_NAME
heroku config:set GMAIL_APP_PASSWORD=fcbaxhdasjcxpfyt -a $APP_NAME

echo "🔨 프로젝트 빌드..."
./gradlew clean build -x test

heroku git:remote -a $APP_NAME

echo "🚀 배포 중..."
git add .
git commit -m "Deploy to Heroku" --allow-empty
git push heroku main -f

echo ""
echo "✅ 배포 완료!"
echo ""
echo "🌐 URL: https://oicrcutieportfolio.herokuapp.com"
echo "🔧 Admin: https://oicrcutieportfolio.herokuapp.com/admin"
echo "   Username: oicrcutie"
echo "   Password: aa667788!!"
echo ""
echo "📝 유용한 명령어:"
echo "  heroku logs --tail -a oicrcutieportfolio"
echo "  heroku ps -a oicrcutieportfolio"
echo "  heroku config -a oicrcutieportfolio"
echo ""

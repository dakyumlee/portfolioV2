#!/bin/bash

echo "🚀 Portfolio 애플리케이션 시작"
echo "================================"
echo ""

# PostgreSQL 확인
echo "🔍 PostgreSQL 확인 중..."
if docker ps | grep -q portfolio-postgres; then
    echo "✅ PostgreSQL이 실행 중입니다."
else
    echo "🐘 PostgreSQL 시작 중..."
    docker-compose up -d
    echo "⏳ PostgreSQL 초기화 대기 (5초)..."
    sleep 5
fi

echo ""
echo "📝 설정 정보:"
echo "  - Admin ID: oicrcutie"
echo "  - Admin PW: aa667788!!"
echo "  - Gmail: oicrcutie@gmail.com"
echo "  - Database: postgresql://localhost:5432/portfolio"
echo ""

echo "🏃 애플리케이션 실행 중..."
echo ""

./gradlew bootRun

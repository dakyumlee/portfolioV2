#!/bin/bash

echo "🐘 PostgreSQL 설정 스크립트"
echo "================================"

# PostgreSQL 설치 확인
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL이 설치되어 있지 않습니다."
    echo ""
    echo "macOS 설치 방법:"
    echo "  brew install postgresql@14"
    echo "  brew services start postgresql@14"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL이 설치되어 있습니다."
echo ""

# PostgreSQL 시작
echo "🚀 PostgreSQL 서비스 시작..."
brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null

sleep 2

# 데이터베이스 생성
echo "📦 데이터베이스 생성 중..."
psql postgres -c "CREATE DATABASE portfolio;" 2>/dev/null && echo "✅ portfolio 데이터베이스 생성 완료" || echo "ℹ️  portfolio 데이터베이스가 이미 존재합니다."

# 사용자 확인
echo ""
echo "👤 PostgreSQL 사용자 정보:"
echo "  Username: postgres"
echo "  Password: postgres (기본값, 필요시 변경)"
echo "  Database: portfolio"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""

# 연결 테스트
echo "🔌 데이터베이스 연결 테스트..."
psql -U postgres -d portfolio -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ 데이터베이스 연결 성공!"
else
    echo "⚠️  연결 실패. 비밀번호 설정이 필요할 수 있습니다."
    echo ""
    echo "비밀번호 설정 방법:"
    echo "  psql postgres"
    echo "  ALTER USER postgres PASSWORD 'postgres';"
    echo "  \\q"
fi

echo ""
echo "✅ PostgreSQL 설정 완료!"
echo ""
echo "📝 다음 단계:"
echo "  1. ./gradlew bootRun"
echo "  2. http://localhost:8080 접속"
echo ""

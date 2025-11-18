FROM gradle:8.5-jdk17-alpine AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY gradlew ./
RUN chmod +x gradlew
COPY src src
RUN ./gradlew clean bootJar -x test --no-daemon
RUN ls -la build/libs/

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN ls -la
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
CMD ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
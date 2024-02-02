FROM openjdk:17-ea-11-jdk-slim
VOLUME /tmp
COPY build/libs/service.config-0.1.jar service.config.jar
ENTRYPOINT ["java","-jar","service.config.jar"]
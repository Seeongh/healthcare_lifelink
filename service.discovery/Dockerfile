FROM openjdk:17-ea-11-jdk-slim
VOLUME /tmp
COPY build/libs/service.discovery-0.1.jar service.discovery.jar
ENTRYPOINT ["java","-jar","service.discovery.jar"]
# Dockerfile
FROM node:20-alpine        
# Base image 지정
WORKDIR /app               
# 컨테이너 시작 시 사용될 working directory 경로
COPY package*.json ./      
# COPY <복사할 파일 경로> <이미지에서 파일이 위치할 경로>  (./ => 현재 위치에서 파일을 하나 만들고 그 아래에 복사한다는 의미)
RUN npm install --legacy-peer-deps
# --silent   
# image 생성 시점에 사용할 명령어 지정
COPY . .                   
# 
CMD [ "npm", "start" ]     
# container 실행 시 실행되는 명령어를 지정한다.
EXPOSE 3001                
# 컨테이너 실행 시 열어둘 포트와 통신 네트워크 프로토콜(=TCP/UDP) 지정한다.
# ADD <호스트OS 파일 경로> <Docker 컨테이너 안에서의 경로> (ADD, COPY 모두 복사하는 명령어)
# Base image: 어플리케이션 실행에 필요한 독립적인 환경을 포함하며, 런타임 환경을 위한 일종의 템플릿
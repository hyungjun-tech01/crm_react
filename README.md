This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
충돌 무시하고 설치해야 설치됨. npm install --legacy-peer-deps  


- multi node 사용시 nvm install 필요, node 20.2 사용함.  
   nvm 설치 : https://blog.naver.com/whmoon00/223348535059  
- docker 사용시 wsl 설치 및 docker desktop 설치 필요.(windows10 or 11)   
   wsl 설치 : https://blog.naver.com/whmoon00/223352656433  
   docker desktop 설치 : https://blog.naver.com/whmoon00/223353329298  

도커 빌드 : docker build -t app .  
도커이미지 확인 : docker images  
docker  실행 확인 : docker ps  
docker 중지 : docker stop <컨테이너 name or ID>  
도커 컨테이너 삭제 : docker rm <docker 컨테이너 id>       
도커 이미지 삭제 : dodker rmi <이미지 id>     

docker 실행 명령   
docker run -p 5000:3001 app    
5000은 접속할 포트 , 필요에 따라 바꾸면 됨, 3001 은 app이 구동되는 포트 , 변경하려면 소스까지 같이 변경해야 함.  

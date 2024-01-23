# TrashIt
<p align="center">
<img src="https://user-images.githubusercontent.com/50871137/235619035-05194752-1e6f-42a8-ab49-a41bd1477cfc.png" width="20%" height="10%" title="앱 이미지" alt="앱 이미지"></img>
</p>

## 서비스 소개
### 서비스 목적
> 주변에 있는 쓰레기통의 위치를 찾을 수 있도록 도와주는 어플리케이션
### 기획 동기
길거리에서 쓰레기가 생겼을 때, 쓰레기통이 많이 배치되어있지 않아 버릴곳이 없어 집까지 가져가거나 주변에 대충 버리는 상황이 자주 발생하였습니다. <br>
따라서, 쓰레기통의 위치 정보를 쉽게 알 수 있는 앱이 있다면 쓰레기 처리에 대한 부담도 줄어들고 환경적으로도 좋을 것 같다고 판단하여 개발을 시작하였습니다.
### 주요 기능
- **쓰레기통 등록 및 쓰레기통 정보 확인**
  - 쓰레기통 등록 시 오브젝트 디텍션을 활용하여 등록한 사진에 실제로 쓰레기통이 있는지 분석합니다.
  - 쓰레기통을 등록하면 다른 유저들이 쓰레기통의 위치와 사진, 추가적인 정보를 확인할 수 있습니다.
- **투표 기능**
  - 쓰레기통 정보 화면에서 쓰레기통에 투표된 정보를 보고 그 쓰레기통이 실제로 있는지 판단할 수 있습니다.
  - 정보를 통해 찾아간 쓰레기통 위치에 정상적으로 쓰레기통이 있다면 좋아요, 아니라면 싫어요를 눌러 다른 유저에게 쓰레기통에 대한 상태를 파악할 수 있도록 해 줍니다.
- **리더보드 기능**
  - 등록한 쓰레기통 개수에 따라 리더보드에 랭킹됩니다.
  - 추후 리워드에 활용할 예정입니다.
 
![trashit-model drawio (2)](https://github.com/entrolEC/Trash-It/assets/47941102/657fd796-9795-4e2c-8c56-8b13c2605436)



## 사용 기술
### Frontend
- React Native
- Google Login
### Backend
- Python 3.9
- Django REST Framework
- JWT
- Tensorflow

## 실행 방법
#### 1. Clone Repository
```bash
git clone https://github.com/entrolEC/Trash-It.git
```
#### 2. Install Packages
```bash
yarn install
```
#### 3. Start Develop
```bash
yarn android
yarn ios
```

## 성과
[**제 4회 KB소프트웨어 경진대회 최우수상**](https://incheonedu-my.sharepoint.com/personal/user1205_o365_ice_go_kr/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fuser1205%5Fo365%5Fice%5Fgo%5Fkr%2FDocuments%2FSW%EB%A7%88%EC%97%90%EC%8A%A4%ED%8A%B8%EB%A1%9C%2FKBSC%20%EC%83%81%EC%9E%A5%2Epng&parent=%2Fpersonal%2Fuser1205%5Fo365%5Fice%5Fgo%5Fkr%2FDocuments%2FSW%EB%A7%88%EC%97%90%EC%8A%A4%ED%8A%B8%EB%A1%9C&ga=1, "상장")을 수상했습니다.

## 추가 정보
#### 발표영상
https://youtu.be/mrb5fSpk5Cs
#### 시연영상 (구)
https://youtu.be/WLQHEkW0I7A
#### Backend Link
https://github.com/qoquma/trashcanMap_backend

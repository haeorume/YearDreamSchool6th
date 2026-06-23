# 실습 문법표 (Practice Cheat Sheet)

이어드림스쿨 6기 실습 203문항에서 추출한 **32개 문법 패턴** 참고 페이지입니다.

## 포함 내용

- 파이썬 (9) · SQL (15) · NumPy (2) · Pandas (5) · 데이터 시각화 (1)
- 카테고리 탭 · 키워드 검색 · 전체 보기(섹션별 그룹)

## 로컬에서 보기

```bash
# 방법 1: 배치 파일 (Windows)
start-server.bat

# 방법 2: Python
python -m http.server 8888 --bind 127.0.0.1
```

브라우저: http://127.0.0.1:8888/

> `index.html`을 파일로 직접 열면 JSON 로드가 안 될 수 있습니다. 반드시 **로컬 서버**로 여세요.

## GitHub에 올리기

1. [YearDreamSchool6th](https://github.com/haeorume/YearDreamSchool6th) 레포에서 **Add file → Upload files**
2. 이 폴더(`docs`) 안의 파일 전체를 드래그 → 레포 루트에 **`docs/`** 폴더로 업로드
3. Commit

## GitHub Pages

1. Settings → **Pages**
2. Source: **Deploy from a branch** → Branch: **main** → Folder: **`/docs`**
3. Save 후 2~5분 대기

접속 주소: **https://haeorume.github.io/YearDreamSchool6th/**

## 폴더 구조

```
docs/
├── .nojekyll
├── index.html
├── css/cheat-sheet.css
├── js/practice-cheat-sheet.js
├── data/practice-cheat-sheet.json
├── start-server.bat
└── README.md
```

## 라이선스

학습가이드 본체와 동일하게 MIT (YearDreamSchool6th 레포 LICENSE 참고)

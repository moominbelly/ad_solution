# ad_solution
create ad solution pages 
## 디자인 시스템

### 컬러 팔레트
```css
--primary: #003459       /* 메인 파란색 */
--primary-hover: #00A8E8 /* hover */
--dark: #00171F          /* 진한 네이비 */
--success: #28a745
--danger: #dc3545
--warning: #ffc107
--info: #17a2b8

### 컴포넌트
- 버튼: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`
- 입력: `.input`, `.select`, `.textarea`, `.checkbox`, `.radio`
- 모달: `.modal`, `.modal-dim`
- 카드: `.card`
- 테이블: `.table`
- 태그: `.tag-item`
- 토글: `.toggle-switch`

### 아이콘
- Font Awesome 6.5.1 (무료 버전)
- CDN: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
```


## 프로젝트 구성 

project/
├── html/
│   └── auto-bid-bulk-upload.html       # 자동입찰 대량 등록 
├── css/
│   ├── reset.css                       # 브라우저 초기화
│   ├── layout.css                      # GNB, Sidebar 레이아웃
|   ├── auto-bid-bulk-upload.css        #자동입찰 대량등록 관련 css 
│   └── components.css                  # 공통 컴포넌트
    
│
├── js/
│   ├── common.js                      # 공통
│   └── auto-bid-bulk-upload-ui.js     # 자동입찰 대량등록 ui 
│
└── README.md                           # 현재 파일 

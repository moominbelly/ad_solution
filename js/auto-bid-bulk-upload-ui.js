// auto-bid-bulk-upload-ui.js

document.addEventListener('DOMContentLoaded', function() {

    // ========== 전역 변수 ==========
    let historyData = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let sortColumn = null;
    let sortDirection = 'asc';
    let selectedFile = null;

    // ========== 템플릿 컬럼 정의 ==========
    const TEMPLATES = {
        register: {
            name: '대량등록_템플릿',
            powerlink: ['광고계정ID', '캠페인명', '광고그룹명', '키워드', '디바이스', '희망순위', '최대입찰가', '최소입찰가', '입찰주기(분)'],
            shopping:  ['광고계정ID', '캠페인명', '광고그룹명', '키워드', '디바이스', '희망순위', '최대입찰가', '최소입찰가', '입찰주기(분)']
        },
        modify: {
            name: '대량수정_템플릿',
            powerlink: ['광고계정ID', '키워드', '디바이스', '희망순위', '최대입찰가', '최소입찰가', '입찰주기(분)'],
            shopping:  ['광고계정ID', '키워드', '디바이스', '희망순위', '최대입찰가', '최소입찰가', '입찰주기(분)']
        },
        delete: {
            name: '대량삭제_템플릿',
            powerlink: ['광고계정ID', '키워드', '디바이스'],
            shopping:  ['광고계정ID', '키워드', '디바이스']
        },
        status: {
            name: '대량사용여부_템플릿',
            powerlink: ['광고계정ID', '키워드', '디바이스', '사용여부(Y/N)'],
            shopping:  ['광고계정ID', '키워드', '디바이스', '사용여부(Y/N)']
        }
    };

    // ========== 광고타입 한글 매핑 ==========
    const AD_TYPE_LABELS = {
        powerlink: '파워링크',
        shopping: '쇼핑검색'
    };

    // ========== 초기화 ==========
    initEventListeners();
    initFileUpload();
    initHistoryTableSort();
    loadHistory();

    // ========== 이벤트 리스너 초기화 ==========
    function initEventListeners() {
        document.getElementById('downloadRegisterTemplate').addEventListener('click', () => downloadTemplate('register'));
        document.getElementById('downloadModifyTemplate').addEventListener('click', () => downloadTemplate('modify'));
        document.getElementById('downloadDeleteTemplate').addEventListener('click', () => downloadTemplate('delete'));
        document.getElementById('downloadStatusTemplate').addEventListener('click', () => downloadTemplate('status'));

        document.getElementById('uploadBtn').addEventListener('click', handleUpload);
        document.getElementById('refreshHistoryBtn').addEventListener('click', loadHistory);
    }

    // ========== 파일 업로드 초기화 ==========
    function initFileUpload() {
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    // ========== 파일 선택 처리 ==========
    function handleFileSelect(file) {
        const allowedExtensions = ['.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            alert('지원하지 않는 파일 형식입니다.\n지원 형식: .xlsx, .xls');
            return;
        }

        selectedFile = file;

        const fileNameEl = document.getElementById('fileName');
        fileNameEl.textContent = file.name;
        fileNameEl.style.display = 'block';
    }

    // ========== 템플릿 다운로드 ==========
    function downloadTemplate(type) {
        const bidType = document.querySelector('input[name="bidType"]:checked').value;
        const template = TEMPLATES[type];
        const headers = template[bidType];
        const fileName = `${template.name}_${AD_TYPE_LABELS[bidType]}`;

        // TODO: 실제로는 SheetJS(xlsx) 라이브러리를 사용하여 .xlsx 파일 생성
        // import * as XLSX from 'xlsx';
        // const ws = XLSX.utils.aoa_to_sheet([headers]);
        // const wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        // XLSX.writeFile(wb, fileName + '.xlsx');

        // 퍼블리싱용: CSV 형식으로 다운로드 (Excel에서 열 수 있음)
        const csvContent = headers.join(',') + '\n';
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ========== 업로드 처리 ==========
    function handleUpload() {
        if (!validateUploadForm()) return;

        const bidType  = document.querySelector('input[name="bidType"]:checked').value;
        const workType = document.querySelector('input[name="workType"]:checked').value;
        const workName = document.getElementById('workName').value.trim();
        const advertiser_id = window.getSelectedAdvertiserId ? window.getSelectedAdvertiserId() : null;

        // TODO: API 호출
        // const formData = new FormData();
        // formData.append('file', selectedFile);
        // formData.append('advertiser_id', advertiser_id);
        // formData.append('bid_type', bidType);
        // formData.append('work_type', workType);
        // formData.append('work_name', workName);
        //
        // fetch('/api/bulk-upload', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(data => {
        //     alert('업로드 요청이 완료되었습니다.');
        //     resetUploadForm();
        //     loadHistory();
        // })
        // .catch(error => {
        //     alert('업로드 실패: ' + error.message);
        // });

        // 퍼블리싱용: 로딩 시뮬레이션
        const btn = document.getElementById('uploadBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';

        setTimeout(() => {
            alert('업로드 요청이 완료되었습니다. (퍼블리싱 모드)');
            resetUploadForm();
            loadHistory();
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-upload"></i> 업로드';
        }, 1500);
    }

    // ========== 폼 검증 ==========
    function validateUploadForm() {
        const workName = document.getElementById('workName').value.trim();

        if (!workName) {
            alert('작업명을 입력해주세요.');
            document.getElementById('workName').focus();
            return false;
        }

        if (!selectedFile) {
            alert('파일을 업로드해주세요.');
            return false;
        }

        return true;
    }

    // ========== 폼 초기화 ==========
    function resetUploadForm() {
        document.getElementById('workName').value = '';
        document.getElementById('fileInput').value = '';
        document.getElementById('fileName').style.display = 'none';
        selectedFile = null;
    }

    // ========== 이력 테이블 정렬 초기화 ==========
    function initHistoryTableSort() {
        const table = document.getElementById('historyTable');
        if (!table) return;

        table.querySelectorAll('th.sortable').forEach(header => {
            header.addEventListener('click', function() {
                handleHistorySort(this.dataset.sort, this);
            });
        });
    }

    // ========== 이력 정렬 처리 ==========
    function handleHistorySort(sortKey, headerElement) {
        const headers = document.getElementById('historyTable').querySelectorAll('th.sortable');

        headers.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
            const icon = h.querySelector('i');
            if (icon) icon.className = 'fas fa-sort';
        });

        if (sortColumn === sortKey) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = sortKey;
            sortDirection = 'asc';
        }

        headerElement.classList.add(sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        const icon = headerElement.querySelector('i');
        if (icon) icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';

        sortHistoryData(sortKey, sortDirection);
        renderHistoryTable();
    }

    // ========== 이력 데이터 정렬 ==========
    function sortHistoryData(sortKey, direction) {
        historyData.sort((a, b) => {
            let valueA = a[sortKey];
            let valueB = b[sortKey];

            if (sortKey === 'request_time') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            }

            if (sortKey === 'result') {
                valueA = a.success_count / a.total_count;
                valueB = b.success_count / b.total_count;
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc'
                    ? valueA.localeCompare(valueB, 'ko')
                    : valueB.localeCompare(valueA, 'ko');
            }

            return 0;
        });
    }

    // ========== 이력 로드 ==========
    function loadHistory() {
        const advertiser_id = window.getSelectedAdvertiserId ? window.getSelectedAdvertiserId() : null;

        // TODO: API 호출
        // fetch(`/api/bulk-upload-history?advertiser_id=${advertiser_id}`)
        // .then(response => response.json())
        // .then(data => {
        //     historyData = data.history;
        //     currentPage = 1;
        //     resetSortHeaders();
        //     renderHistoryTable();
        //     renderHistoryPagination();
        // });

        // 퍼블리싱용 더미 데이터
        setTimeout(() => {
            historyData = generateDummyHistoryData(15);
            currentPage = 1;
            sortColumn = null;
            sortDirection = 'asc';
            resetSortHeaders();
            renderHistoryTable();
            renderHistoryPagination();
        }, 400);
    }

    // ========== 정렬 헤더 초기화 ==========
    function resetSortHeaders() {
        const table = document.getElementById('historyTable');
        if (!table) return;

        table.querySelectorAll('th.sortable').forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
            const icon = h.querySelector('i');
            if (icon) icon.className = 'fas fa-sort';
        });
    }

    // ========== 이력 테이블 렌더링 ==========
    function renderHistoryTable() {
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';

        document.getElementById('totalCount').textContent = historyData.length;

        if (historyData.length === 0) {
            document.getElementById('emptyState').style.display = 'flex';
            return;
        }

        document.getElementById('emptyState').style.display = 'none';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageData = historyData.slice(startIndex, startIndex + itemsPerPage);

        pageData.forEach(item => {
            const tr = document.createElement('tr');

            const resultClass = item.success_count === item.total_count ? 'success' :
                                item.success_count === 0 ? 'fail' : 'partial';

            tr.innerHTML = `
                <td>${item.account_id}</td>
                <td>${item.work_name}</td>
                <td>${item.ad_type}</td>
                <td>${item.work_type}</td>
                <td><span class="result-badge ${resultClass}">${item.success_count}/${item.total_count}건</span></td>
                <td>${item.register_user}</td>
                <td style="font-size: 12px; white-space: nowrap;">${item.request_time}</td>
                <td>
                    <a href="#" class="file-link" data-file="${item.request_file}">
                        <i class="fas fa-file-excel"></i> 다운로드
                    </a>
                </td>
                <td>
                    <a href="#" class="file-link result-file-link" data-file="${item.result_file}" data-success="${item.success_count}" data-total="${item.total_count}">
                        <i class="fas fa-file-excel"></i> 다운로드
                    </a>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // 파일 다운로드 이벤트 위임
        attachFileDownloadListeners();
    }

    // ========== 파일 다운로드 이벤트 리스너 ==========
    function attachFileDownloadListeners() {
        document.querySelectorAll('#historyTableBody .file-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const fileName = this.dataset.file;

                // TODO: 실제 파일 다운로드 API 호출
                // fetch(`/api/bulk-upload/download?file=${fileName}`)
                // .then(response => response.blob())
                // .then(blob => {
                //     const url = URL.createObjectURL(blob);
                //     const a = document.createElement('a');
                //     a.href = url;
                //     a.download = fileName;
                //     a.click();
                //     URL.revokeObjectURL(url);
                // });

                // 결과파일: 퍼블리싱용 모의 행별 결과 CSV 생성
                if (this.classList.contains('result-file-link')) {
                    const successCount = parseInt(this.dataset.success);
                    const totalCount   = parseInt(this.dataset.total);
                    downloadMockResultFile(fileName, successCount, totalCount);
                    return;
                }

                // 요청파일: 퍼블리싱용 alert
                alert(`파일 다운로드: ${fileName} (퍼블리싱 모드)`);
            });
        });
    }

    // ========== 퍼블리싱용 모의 결과파일 생성 ==========
    function downloadMockResultFile(fileName, successCount, totalCount) {
        const mockKeywords  = ['운동화', '러닝화', '워킹화', '트레킹화', '등산화', '스니커즈', '하이킹신발', '조깅화', '축구화', '테니스화', '배드민턴화', '탁구화', '수영로드', '체조화', '발레화', '스퀘시화', '클라이밍신발', '사이클신발', '로드바이크신발', '크로스트레이너'];
        const failReasons   = ['입찰가 범위 초과', '키워드 중복', '캠페인 비활성화', '예산 초과', '금지 키워드', '광고그룹 없음'];

        const rows = [['행번호', '키워드', '결과', '실패사유']];

        for (let i = 0; i < totalCount; i++) {
            const keyword  = mockKeywords[i % mockKeywords.length];
            const isSuccess = i < successCount;
            rows.push([
                i + 1,
                keyword,
                isSuccess ? '성공' : '실패',
                isSuccess ? '-' : failReasons[Math.floor(Math.random() * failReasons.length)]
            ]);
        }

        const csvContent = rows.map(row => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href     = url;
        link.download = fileName.replace('.xlsx', '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ========== 페이지네이션 렌더링 ==========
    function renderHistoryPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(historyData.length / itemsPerPage);

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        pagination.innerHTML = '';

        // 이전 버튼
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = '이전';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderHistoryTable();
                renderHistoryPagination();
            }
        });
        pagination.appendChild(prevBtn);

        // 페이지 번호
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderHistoryTable();
                renderHistoryPagination();
            });
            pagination.appendChild(pageBtn);
        }

        // 다음 버튼
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = '다음';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderHistoryTable();
                renderHistoryPagination();
            }
        });
        pagination.appendChild(nextBtn);
    }

    // ========== 더미 이력 데이터 생성 ==========
    function generateDummyHistoryData(count) {
        const workTypes   = ['등록', '수정', '삭제', '사용여부'];
        const adTypes     = ['파워링크', '쇼핑검색'];
        const users       = ['홍길동', '김철수', '이영희'];
        const accountIds  = ['ACC-2024-001', 'ACC-2024-002', 'ACC-2024-003'];

        const data = [];
        const now  = new Date();

        for (let i = 0; i < count; i++) {
            const date = new Date(now);
            date.setHours(date.getHours() - i * 2);

            const totalCount   = 5 + Math.floor(Math.random() * 16); // 5~20건
            const successCount = Math.floor(Math.random() * (totalCount + 1)); // 0~totalCount건

            data.push({
                account_id:    accountIds[Math.floor(Math.random() * accountIds.length)],
                work_name:     `작업_${String(count - i).padStart(3, '0')}`,
                ad_type:       adTypes[Math.floor(Math.random() * adTypes.length)],
                work_type:     workTypes[Math.floor(Math.random() * workTypes.length)],
                total_count:   totalCount,
                success_count: successCount,
                register_user: users[Math.floor(Math.random() * users.length)],
                request_time:  date.toLocaleString('ko-KR'),
                request_file:  `upload_${String(count - i).padStart(3, '0')}.xlsx`,
                result_file:   `result_${String(count - i).padStart(3, '0')}.xlsx`
            });
        }

        return data;
    }
});

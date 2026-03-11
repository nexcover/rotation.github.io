let vacations = new Set();
const today = new Date(); // 현재 실제 날짜
today.setHours(0, 0, 0, 0);

function addVacation() {
    const date = document.getElementById('vacationDate').value;
    if (date) {
        vacations.add(date);
        renderAll();
    }
}

function resetVacations() {
    vacations.clear();
    renderAll();
}

function getShift(targetDate, baseDate) {
    const diffTime = targetDate - baseDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return null;

    const pattern = ['주간', '주간', '야간', '야간', '비번', '비번'];
    return pattern[diffDays % 6];
}

function renderMonth(year, month, baseDate) {
    const container = document.createElement('div');
    container.className = 'month-card';

    let html = `<div class="month-title">${year}년 ${month + 1}월</div>`;
    html += `<table><thead><tr><th class="sunday">일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th class="saturday">토</th></tr></thead><tbody><tr>`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();

    for (let i = 0; i < startDayOfWeek; i++) html += `<td></td>`;

    for (let day = 1; day <= lastDay; day++) {
        const current = new Date(year, month, day);
        current.setHours(0, 0, 0, 0);

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const shift = getShift(current, baseDate);

        let classes = [`shift-${shift}`];
        let displayText = shift || '';

        // 휴가 체크
        if (vacations.has(dateStr)) {
            classes.push('is-holiday');
            displayText = '휴가';
        }

        // 오늘 날짜 체크 (검은 테두리)
        if (current.getTime() === today.getTime()) {
            classes.push('is-today');
        }

        const className = classes.join(' ');
        const isTodayText = current.getTime() === today.getTime() ? '<span class="today-label"></span>' : '';

        html += `<td class="${className}">${day}${isTodayText}<br><small>${displayText}</small></td>`;

        if ((day + startDayOfWeek) % 7 === 0) html += `</tr><tr>`;
    }

    html += `</tr></tbody></table>`;
    container.innerHTML = html;
    return container;
}

function renderAll() {
    const view = document.getElementById('calendars');
    const baseDateValue = document.getElementById('baseDate').value;
    const baseDate = new Date(baseDateValue);
    baseDate.setHours(0, 0, 0, 0);

    view.innerHTML = '';
    // 2026년 1월(0)부터 4월(3)까지 출력
    for (let m = 0; m < 4; m++) {
        view.appendChild(renderMonth(2026, m, baseDate));
    }
}

document.getElementById('baseDate').addEventListener('change', renderAll);
renderAll();
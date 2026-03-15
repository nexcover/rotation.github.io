const shifts = ['주', '주', '야', '야', '비', '비'];
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const currentDate = today.getDate();

function getShiftIndexForDate(year, month, day) {
    const baseDate = new Date(2026, 0, 1); // 2026년 1월 1일 기준
    const targetDate = new Date(year, month, day);
    const diffTime = targetDate - baseDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % 6;
}

function updateMonthDisplay() {
    document.getElementById('currentMonthDisplay').textContent = `${currentYear}년 ${currentMonth + 1}월`;
}

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    let html = '';
    let day = 1;
    let shiftIndex = getShiftIndexForDate(year, month, 1);

    for (let week = 0; week < 6; week++) {
        html += '<tr>';
        for (let weekday = 0; weekday < 7; weekday++) {
            if ((week === 0 && weekday < startDay) || day > totalDays) {
                html += '<td></td>';
            } else {
                const isToday = (day === currentDate && month === today.getMonth() && year === today.getFullYear());
                const vacationKey = `vacation_${year}_${month}_${day}`;
                const isVacation = localStorage.getItem(vacationKey) === 'true';
                const shift = isVacation ? '휴가' : shifts[shiftIndex % 6];
                const className = isToday ? 'today' : (isVacation ? 'vacation' : `shift-${shifts[shiftIndex % 6]}`);
                html += `<td class="${className}" data-day="${day}" data-shift="${shiftIndex % 6}">${day}<br>${shift}</td>`;
                shiftIndex++;
                day++;
            }
        }
        html += '</tr>';
        if (day > totalDays) break;
    }
    document.getElementById('calendarBody').innerHTML = html;

    // 클릭 이벤트 추가
    document.querySelectorAll('#calendarBody td[data-day]').forEach(cell => {
        cell.addEventListener('click', function () {
            const day = this.getAttribute('data-day');
            const originalShiftIndex = this.getAttribute('data-shift');
            const originalShift = shifts[originalShiftIndex];
            const vacationKey = `vacation_${year}_${month}_${day}`;
            const isVacation = localStorage.getItem(vacationKey) === 'true';
            if (isVacation) {
                // 휴가에서 원래 근무로
                this.innerHTML = `${day}<br>${originalShift}`;
                this.classList.remove('vacation');
                this.classList.add(`shift-${originalShift}`);
                localStorage.removeItem(vacationKey);
            } else {
                // 근무에서 휴가로
                this.innerHTML = `${day}<br>휴가`;
                this.classList.remove(`shift-${originalShift}`);
                this.classList.add('vacation');
                localStorage.setItem(vacationKey, 'true');
            }
        });
    });
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateMonthDisplay();
    generateCalendar(currentYear, currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateMonthDisplay();
    generateCalendar(currentYear, currentMonth);
});

updateMonthDisplay();
generateCalendar(currentYear, currentMonth);
(function () {
    function render() {
        const guests = window.CWPSStorage.getGuests();
        const vendors = window.CWPSStorage.getVendors();
        const tasks = window.CWPSStorage.getTasks();
        const budget = window.CWPSStorage.getBudgetItems();
        const totalBudget = window.CWPSStorage.getTotalBudget();
        const spent = budget.reduce((s, b) => s + (Number(b.actual) || 0), 0);

        const confirmed = guests.filter(g => g.rsvp === 'Yes').length;
        const metrics = [
            { label: 'Guest List', value: confirmed, note: 'confirmed guests' },
            { label: 'Budget', value: currency(spent), note: '$ spent' },
            { label: 'Vendors', value: vendors.length, note: 'booked vendors' },
            { label: 'Progress', value: Math.round((tasks.filter(t => t.done).length / (tasks.length||1)) * 100) + '%', note: 'tasks completed' }
        ];
        const grid = document.getElementById('dashboardMetrics');
        grid.innerHTML = '';
        metrics.forEach(m => grid.appendChild(metric(m.value, m.label, m.note)));

        const progressPct = Math.round((tasks.filter(t => t.done).length / (tasks.length||1)) * 100);
        document.getElementById('progressBar').style.width = progressPct + '%';
        document.getElementById('progressMeta').textContent = `${tasks.filter(t=>t.done).length} of ${tasks.length} tasks completed`;

        const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((spent / totalBudget) * 100)) : 0;
        document.getElementById('budgetBar').style.width = budgetPct + '%';
        document.getElementById('budgetMeta').textContent = `Budget Used ${budgetPct}%`;
    }

    function metric(value, label, note) {
        const el = document.createElement('div'); el.className='metric';
        el.innerHTML = `<div class="value">${value}</div><div class="label">${label}</div><div class="meta">${note}</div>`;
        return el;
    }

    function currency(n) { return new Intl.NumberFormat('en-US', { style:'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n)||0); }

    function init() {
        document.getElementById('qaGuests').addEventListener('click', () => window.UI.switchTab('guests'));
        document.getElementById('qaBudget').addEventListener('click', () => window.UI.switchTab('budget'));
        document.getElementById('qaVendors').addEventListener('click', () => window.UI.switchTab('vendors'));
        document.getElementById('qaSchedule').addEventListener('click', () => window.UI.switchTab('schedule'));
        render();
    }

    window.Dashboard = { init, render };
})();


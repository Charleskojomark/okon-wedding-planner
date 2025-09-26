(function () {
    const listEl = () => document.getElementById('budgetList');

    function render() {
        const items = window.CWPSStorage.getBudgetItems();
        const el = listEl(); el.innerHTML = '';
        let sumPlanned = 0, sumActual = 0;
        items.forEach(b => {
            sumPlanned += Number(b.planned) || 0;
            sumActual += Number(b.actual) || 0;
            el.appendChild(renderCard(b));
        });
        const totalBudget = window.CWPSStorage.getTotalBudget();
        const remaining = Math.max(0, totalBudget - sumActual);
        const pct = totalBudget > 0 ? Math.min(100, Math.round((sumActual / totalBudget) * 100)) : 0;
        renderStats(totalBudget, sumActual, remaining, pct);
    }

    function renderStats(totalBudget, spent, remaining, pct) {
        const grid = document.getElementById('budgetStats');
        grid.innerHTML = '';
        grid.appendChild(stat(formatCurrency(totalBudget), 'Total Budget'));
        grid.appendChild(stat(formatCurrency(spent), 'Total Spent'));
        grid.appendChild(stat(formatCurrency(remaining), 'Remaining'));
        grid.appendChild(stat(pct + '%', 'Budget Used'));
    }

    function stat(value, label) { const d=document.createElement('div'); d.className='metric'; d.innerHTML=`<div class="value">${value}</div><div class="label">${label}</div>`; return d; }

    function renderCard(b) {
        const card = document.createElement('div'); card.className='card';
        const left = document.createElement('div');
        left.innerHTML = `<div><strong>${b.name || 'Item'}</strong></div><div class="meta">Planned: ${formatCurrency(b.planned)} · Actual: ${formatCurrency(b.actual)}</div>`;
        const actions = document.createElement('div'); actions.className='row';
        const editBtn = button('Edit', () => openEdit(b));
        const delBtn = button('Delete', () => { if (confirm('Delete item?')) { window.CWPSStorage.removeBudgetItem(b.id); render(); window.UI.toast('Item deleted'); } });
        actions.appendChild(editBtn); actions.appendChild(delBtn);
        card.appendChild(left); card.appendChild(actions);
        return card;
    }

    function button(label, onClick) { const b = document.createElement('button'); b.className='btn secondary'; b.textContent=label; b.addEventListener('click', onClick); return b; }

    function formatCurrency(n) {
        const num = Number(n) || 0;
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(num);
    }

    function openEdit(item = { name: '', planned: '', actual: '' }) {
        const { wrap: nameW, input: nameI } = window.UI.buildInput('Item name', item.name, { placeholder: 'e.g., Venue' });
        const { wrap: planW, input: planI } = window.UI.buildInput('Planned (₦)', item.planned, { inputmode: 'decimal', placeholder: '0' });
        const { wrap: actW, input: actI } = window.UI.buildInput('Actual (₦)', item.actual, { inputmode: 'decimal', placeholder: '0' });
        const form = document.createElement('div');
        form.appendChild(nameW); form.appendChild(planW); form.appendChild(actW);
        const actions = document.createElement('div'); actions.className='actions';
        const save = document.createElement('button'); save.className='btn primary'; save.textContent='Save'; save.disabled = !(item.name||'').trim();
        const cancel = document.createElement('button'); cancel.className='btn secondary'; cancel.textContent='Cancel';
        actions.appendChild(cancel); actions.appendChild(save); form.appendChild(actions);
        const dialog = window.UI.openModal(form);
        cancel.addEventListener('click', () => dialog.close());
        nameI.addEventListener('input', () => save.disabled = nameI.value.trim().length === 0);
        form.addEventListener('keydown', (e) => { if (e.key==='Enter') { e.preventDefault(); if (!save.disabled) save.click(); } });
        save.addEventListener('click', () => {
            const payload = { name: nameI.value.trim(), planned: Number(planI.value||0), actual: Number(actI.value||0) };
            if (!item.id) window.CWPSStorage.addBudgetItem(payload); else window.CWPSStorage.updateBudgetItem(item.id, payload);
            dialog.close(); render(); window.UI.toast('Saved');
        });
    }

    function init() {
        document.getElementById('addBudgetItemBtn').addEventListener('click', () => openEdit());
        document.getElementById('budgetItemName').addEventListener('keydown', (e) => { if (e.key==='Enter') document.getElementById('addBudgetItemBtn').click(); });
        document.getElementById('budgetPlanned').addEventListener('keydown', (e) => { if (e.key==='Enter') document.getElementById('addBudgetItemBtn').click(); });
        document.getElementById('budgetActual').addEventListener('keydown', (e) => { if (e.key==='Enter') document.getElementById('addBudgetItemBtn').click(); });
        document.getElementById('addBudgetItemBtn').addEventListener('click', () => {
            const n = document.getElementById('budgetItemName');
            const p = document.getElementById('budgetPlanned');
            const a = document.getElementById('budgetActual');
            const name = n.value.trim(); if (!name) { window.UI.toast('Enter item name'); return; }
            const planned = Number(p.value||0); const actual = Number(a.value||0);
            window.CWPSStorage.addBudgetItem({ name, planned, actual });
            n.value=''; p.value=''; a.value='';
            render(); window.UI.toast('Item added');
        });
        document.getElementById('updateTotalBudgetBtn').addEventListener('click', () => {
            const val = Number(document.getElementById('totalBudgetInput').value||0);
            window.CWPSStorage.setTotalBudget(val);
            render(); window.UI.toast('Total budget updated');
        });
        document.getElementById('totalBudgetInput').value = window.CWPSStorage.getTotalBudget() || '';
        render();
    }

    window.Budget = { init, render, openNew: () => openEdit() };
})();


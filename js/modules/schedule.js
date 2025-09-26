(function () {
    const listEl = () => document.getElementById('taskList');

    function render() {
        const tasks = window.CWPSStorage.getTasks().sort((a,b) => (a.done===b.done?0:a.done?1:-1) || (a.due||'').localeCompare(b.due||''));
        const el = listEl(); el.innerHTML='';
        tasks.forEach(t => el.appendChild(renderCard(t)));
    }

    function renderCard(t) {
        const card = document.createElement('div'); card.className='card';
        const left = document.createElement('div');
        const due = t.due ? new Date(t.due) : null;
        const overdue = due && !t.done && due < new Date();
        left.innerHTML = `<div><strong>${t.name || 'Task'}</strong></div><div class="meta">${t.due ? ('Due: ' + t.due) : 'No due date'}</div>`;
        const middle = document.createElement('div'); middle.className='row';
        const status = document.createElement('span'); status.className='badge ' + (t.done ? 'success' : overdue ? 'warn' : ''); status.textContent = t.done ? 'Done' : (overdue ? 'Overdue' : 'Pending');
        middle.appendChild(status);
        const actions = document.createElement('div'); actions.className='row';
        const toggle = button(t.done ? 'Mark Pending' : 'Mark Done', () => { window.CWPSStorage.updateTask(t.id, { done: !t.done }); render(); });
        const editBtn = button('Edit', () => openEdit(t));
        const delBtn = button('Delete', () => { if (confirm('Delete task?')) { window.CWPSStorage.removeTask(t.id); render(); window.UI.toast('Task deleted'); } });
        actions.appendChild(toggle); actions.appendChild(editBtn); actions.appendChild(delBtn);
        card.appendChild(left); card.appendChild(middle); card.appendChild(actions);
        return card;
    }

    function button(label, onClick) { const b = document.createElement('button'); b.className='btn secondary'; b.textContent=label; b.addEventListener('click', onClick); return b; }

    function openEdit(t = { name: '', due: '', done: false }) {
        const { wrap: nameW, input: nameI } = window.UI.buildInput('Task', t.name, { placeholder: 'Describe the task' });
        const { wrap: dueW, input: dueI } = window.UI.buildInput('Due date', t.due, { type: 'date' });
        const form = document.createElement('div'); form.appendChild(nameW); form.appendChild(dueW);
        const actions = document.createElement('div'); actions.className='actions';
        const save = document.createElement('button'); save.className='btn primary'; save.textContent='Save'; save.disabled = !(t.name||'').trim();
        const cancel = document.createElement('button'); cancel.className='btn secondary'; cancel.textContent='Cancel';
        actions.appendChild(cancel); actions.appendChild(save); form.appendChild(actions);
        const dialog = window.UI.openModal(form);
        cancel.addEventListener('click', () => dialog.close());
        nameI.addEventListener('input', () => save.disabled = nameI.value.trim().length === 0);
        form.addEventListener('keydown', (e) => { if (e.key==='Enter') { e.preventDefault(); if (!save.disabled) save.click(); } });
        save.addEventListener('click', () => {
            const payload = { name: nameI.value.trim(), due: dueI.value };
            if (!t.id) window.CWPSStorage.addTask(payload); else window.CWPSStorage.updateTask(t.id, payload);
            dialog.close(); render(); window.UI.toast('Saved');
        });
    }

    function init() {
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            const name = document.getElementById('taskName').value.trim();
            const due = document.getElementById('taskDue').value;
            if (!name) { window.UI.toast('Enter task'); return; }
            window.CWPSStorage.addTask({ name, due });
            document.getElementById('taskName').value=''; document.getElementById('taskDue').value='';
            render(); window.UI.toast('Task added');
        });
        render();
    }

    window.Schedule = { init, render, openNew: () => openEdit() };
})();


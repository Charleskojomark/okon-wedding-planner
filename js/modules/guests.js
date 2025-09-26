(function () {
    const listEl = () => document.getElementById('guestList');

    function render() {
        const q = document.getElementById('guestSearch').value.toLowerCase();
        const guests = window.CWPSStorage.getGuests().filter(g => g.name.toLowerCase().includes(q));
        const el = listEl();
        el.innerHTML = '';
        renderStats();
        guests.forEach(g => el.appendChild(renderCard(g)));
    }

    function renderStats() {
        const guests = window.CWPSStorage.getGuests();
        const total = guests.length;
        const yes = guests.filter(g => g.rsvp==='Yes').length;
        const no = guests.filter(g => g.rsvp==='No').length;
        const pending = total - yes - no;
        const grid = document.getElementById('guestStats');
        if (!grid) return;
        grid.innerHTML='';
        grid.appendChild(metric(total, 'Total Guests'));
        grid.appendChild(metric(yes, 'Attending'));
        grid.appendChild(metric(pending, 'Pending'));
        grid.appendChild(metric(no, 'Not Attending'));
    }

    function metric(value, label) { const el=document.createElement('div'); el.className='metric'; el.innerHTML=`<div class="value">${value}</div><div class="label">${label}</div>`; return el; }

    function renderCard(g) {
        const card = document.createElement('div');
        card.className = 'card';
        const left = document.createElement('div');
        left.innerHTML = `<div><strong>${g.name || 'Unnamed'}</strong></div><div class="meta">${g.contact || ''}</div>`;
        const middle = document.createElement('div');
        middle.className = 'row';
        const rsvp = document.createElement('span');
        rsvp.className = 'badge ' + (g.rsvp === 'Yes' ? 'success' : g.rsvp === 'No' ? 'warn' : '');
        rsvp.textContent = `RSVP: ${g.rsvp}`;
        const side = document.createElement('span');
        side.className = 'badge';
        side.textContent = g.side || 'Bride';
        middle.appendChild(rsvp);
        middle.appendChild(side);

        const actions = document.createElement('div');
        actions.className = 'row';
        const editBtn = button('Edit', () => openEdit(g));
        const delBtn = button('Delete', () => { if (confirm('Delete guest?')) { window.CWPSStorage.removeGuest(g.id); render(); window.UI.toast('Guest deleted'); } });
        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        card.appendChild(left);
        card.appendChild(middle);
        card.appendChild(actions);
        return card;
    }

    function button(label, onClick) {
        const b = document.createElement('button');
        b.className = 'btn secondary';
        b.textContent = label;
        b.addEventListener('click', onClick);
        return b;
    }

    function openEdit(g = { name: '', contact: '', side: 'Bride', rsvp: 'Pending' }) {
        const { wrap: nameWrap, input: nameI } = window.UI.buildInput('Name', g.name, { placeholder: 'Full name' });
        const { wrap: contactWrap, input: contactI } = window.UI.buildInput('Contact', g.contact, { placeholder: 'Phone or email' });
        const sideWrap = document.createElement('div'); sideWrap.className = 'form-row';
        sideWrap.innerHTML = '<label>Side</label>';
        const sideSel = document.createElement('select'); sideSel.className = 'input';
        ['Bride','Groom','Both','Other'].forEach(s => { const o = document.createElement('option'); o.value=s; o.textContent=s; if (g.side===s) o.selected=true; sideSel.appendChild(o); });
        sideWrap.appendChild(sideSel);
        const rsvpWrap = document.createElement('div'); rsvpWrap.className = 'form-row';
        rsvpWrap.innerHTML = '<label>RSVP</label>';
        const rsvpSel = document.createElement('select'); rsvpSel.className = 'input';
        ['Pending','Yes','No'].forEach(s => { const o = document.createElement('option'); o.value=s; o.textContent=s; if (g.rsvp===s) o.selected=true; rsvpSel.appendChild(o); });
        rsvpWrap.appendChild(rsvpSel);

        const form = document.createElement('div');
        form.appendChild(nameWrap);
        form.appendChild(contactWrap);
        form.appendChild(sideWrap);
        form.appendChild(rsvpWrap);
        const actions = document.createElement('div'); actions.className='actions';
        const save = document.createElement('button'); save.className='btn primary'; save.textContent='Save'; save.disabled = !g.name;
        const cancel = document.createElement('button'); cancel.className='btn secondary'; cancel.textContent='Cancel';
        actions.appendChild(cancel); actions.appendChild(save);
        form.appendChild(actions);

        const dialog = window.UI.openModal(form);
        cancel.addEventListener('click', () => dialog.close());
        nameI.addEventListener('input', () => save.disabled = nameI.value.trim().length === 0);
        form.addEventListener('keydown', (e) => { if (e.key==='Enter') { e.preventDefault(); if (!save.disabled) save.click(); } });
        save.addEventListener('click', () => {
            const payload = { name: nameI.value.trim(), contact: contactI.value.trim(), side: sideSel.value, rsvp: rsvpSel.value };
            if (!g.id) window.CWPSStorage.addGuest(payload); else window.CWPSStorage.updateGuest(g.id, payload);
            dialog.close(); render(); window.UI.toast('Saved');
        });
    }

    function init() {
        document.getElementById('addGuestBtn').addEventListener('click', () => openEdit());
        document.getElementById('guestSearch').addEventListener('input', render);
        render();
    }

    window.Guests = { init, render, openNew: () => openEdit() };
})();


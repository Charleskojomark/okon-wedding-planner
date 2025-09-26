(function () {
    const listEl = () => document.getElementById('vendorList');

    function render() {
        const q = document.getElementById('vendorSearch').value.toLowerCase();
        const vendors = window.CWPSStorage.getVendors().filter(v => (v.name+" "+(v.category||'')).toLowerCase().includes(q));
        const el = listEl();
        el.innerHTML = '';
        vendors.forEach(v => el.appendChild(renderCard(v)));
    }

    function renderCard(v) {
        const card = document.createElement('div');
        card.className = 'card';
        const left = document.createElement('div');
        left.innerHTML = `<div><strong>${v.name || 'Unnamed'}</strong></div><div class="meta">${v.category || ''} ${v.contact ? ' · '+v.contact : ''}</div>`;
        const actions = document.createElement('div');
        actions.className = 'row';
        const editBtn = button('Edit', () => openEdit(v));
        const delBtn = button('Delete', () => { if (confirm('Delete vendor?')) { window.CWPSStorage.removeVendor(v.id); render(); window.UI.toast('Vendor deleted'); } });
        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        card.appendChild(left);
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

    function openEdit(v = { name: '', category: '', contact: '', notes: '' }) {
        const { wrap: nameW, input: nameI } = window.UI.buildInput('Name', v.name, { placeholder: 'Vendor name' });
        const { wrap: catW, input: catI } = window.UI.buildInput('Category', v.category, { placeholder: 'e.g., Catering' });
        const { wrap: contactW, input: contactI } = window.UI.buildInput('Contact', v.contact, { placeholder: 'Phone or email' });
        const notesW = document.createElement('div'); notesW.className = 'form-row';
        const nl = document.createElement('label'); nl.textContent = 'Notes';
        const ta = document.createElement('textarea'); ta.className = 'input'; ta.value = v.notes || ''; ta.rows = 4;
        notesW.appendChild(nl); notesW.appendChild(ta);

        const form = document.createElement('div');
        form.appendChild(nameW); form.appendChild(catW); form.appendChild(contactW); form.appendChild(notesW);
        const actions = document.createElement('div'); actions.className='actions';
        const save = document.createElement('button'); save.className='btn primary'; save.textContent='Save'; save.disabled = !(v.name||'').trim();
        const cancel = document.createElement('button'); cancel.className='btn secondary'; cancel.textContent='Cancel';
        actions.appendChild(cancel); actions.appendChild(save);
        form.appendChild(actions);
        const dialog = window.UI.openModal(form);
        cancel.addEventListener('click', () => dialog.close());
        nameI.addEventListener('input', () => save.disabled = nameI.value.trim().length === 0);
        form.addEventListener('keydown', (e) => { if (e.key==='Enter') { e.preventDefault(); if (!save.disabled) save.click(); } });
        save.addEventListener('click', () => {
            const payload = { name: nameI.value.trim(), category: catI.value.trim(), contact: contactI.value.trim(), notes: ta.value.trim() };
            if (!v.id) window.CWPSStorage.addVendor(payload); else window.CWPSStorage.updateVendor(v.id, payload);
            dialog.close(); render(); window.UI.toast('Saved');
        });
    }

    function init() {
        const addBtn = document.getElementById('addVendorBtn');
        if (addBtn) addBtn.addEventListener('click', () => openEdit());
        const search = document.getElementById('vendorSearch');
        if (search) search.addEventListener('input', render);
        render();
    }

    window.Vendors = { init, render, openNew: () => openEdit() };
})();


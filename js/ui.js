(function () {
    function toast(message) {
        const el = document.getElementById('toast');
        el.textContent = message;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 1800);
    }

    function switchTab(tab) {
        const map = {
            dashboard: document.getElementById('tab-dashboard'),
            guests: document.getElementById('tab-guests'),
            vendors: document.getElementById('tab-vendors'),
            budget: document.getElementById('tab-budget'),
            schedule: document.getElementById('tab-schedule'),
            about: document.getElementById('tab-about')
        };
        Object.keys(map).forEach(k => map[k] && map[k].classList.toggle('active', k === tab));
        document.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab')===tab));
        if (tab === 'dashboard') window.Dashboard.render();
        if (tab === 'guests') window.Guests.render();
        if (tab === 'budget') window.Budget.render();
        if (tab === 'vendors') window.Vendors.render();
        if (tab === 'schedule') window.Schedule.render();
    }

    function openModal(inner) {
        const dialog = document.getElementById('modal');
        const form = document.getElementById('modalForm');
        form.innerHTML = '';
        form.appendChild(inner);
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', 'open');
        return { close: () => dialog.close() };
    }

    function buildInput(label, value = '', attrs = {}) {
        const wrap = document.createElement('div');
        wrap.className = 'form-row';
        const l = document.createElement('label');
        l.textContent = label;
        const i = document.createElement('input');
        i.className = 'input';
        i.value = value;
        Object.entries(attrs).forEach(([k, v]) => i.setAttribute(k, v));
        wrap.appendChild(l);
        wrap.appendChild(i);
        return { wrap, input: i };
    }

    window.UI = { toast, openModal, buildInput, switchTab };
})();


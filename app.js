(function () {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    navLinks.forEach(btn => btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        window.UI.switchTab(tab);
    }));

    // Brand click -> dashboard
    const brand = document.getElementById('brandBtn');
    if (brand) brand.addEventListener('click', () => window.UI.switchTab('dashboard'));

    // Hamburger menu
    const menuBtn = document.getElementById('menuBtn');
    const menuPanel = document.getElementById('menuPanel');
    if (menuBtn && menuPanel) {
        function toggleMenu(show) {
            const willShow = typeof show === 'boolean' ? show : !menuPanel.classList.contains('show');
            menuPanel.classList.toggle('show', willShow);
            menuBtn.setAttribute('aria-expanded', String(willShow));
            menuPanel.setAttribute('aria-hidden', String(!willShow));
        }
        menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
        document.addEventListener('click', (e) => { if (!menuPanel.contains(e.target)) toggleMenu(false); });
        menuPanel.addEventListener('click', (e) => e.stopPropagation());
    }

    // Global actions
    document.getElementById('exportBtn').addEventListener('click', () => {
        const data = window.CWPSStorage.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `cwps-backup-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        window.UI.toast('Exported data');
    });

    document.getElementById('importInput').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const text = await file.text();
        try {
            const data = JSON.parse(text);
            window.CWPSStorage.importAll(data);
            window.UI.toast('Imported data');
            window.Dashboard.render();
            window.Guests.render();
            window.Vendors.render();
            window.Budget.render();
            window.Schedule.render();
        } catch (err) {
            window.UI.toast('Invalid backup file');
        } finally {
            e.target.value = '';
        }
    });

    document.getElementById('clearAllBtn').addEventListener('click', () => {
        if (confirm('Clear all data? This cannot be undone.')) {
            window.CWPSStorage.clearAll();
            window.UI.toast('All data cleared');
            window.Dashboard.render();
            window.Guests.render();
            window.Vendors.render();
            window.Budget.render();
            window.Schedule.render();
        }
    });

    // Init modules
    window.Dashboard.init();
    window.Guests.init();
    window.Vendors.init();
    window.Budget.init();
    window.Schedule.init();

    // Floating Add buttons (mobile convenience)
    const fabMap = [
        ['fabGuests', () => window.Guests.openNew && window.Guests.openNew()],
        ['fabVendors', () => window.Vendors.openNew && window.Vendors.openNew()],
        ['fabBudget', () => window.Budget.openNew && window.Budget.openNew()],
        ['fabSchedule', () => window.Schedule.openNew && window.Schedule.openNew()]
    ];
    fabMap.forEach(([id, fn]) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); });
})();


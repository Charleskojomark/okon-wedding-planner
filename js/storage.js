(function () {
    const KEY = 'cwps:v1';

    function loadRoot() {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return { guests: [], vendors: [], budget: [], tasks: [], totalBudget: 0 };
            const parsed = JSON.parse(raw);
            return {
                guests: Array.isArray(parsed.guests) ? parsed.guests : [],
                vendors: Array.isArray(parsed.vendors) ? parsed.vendors : [],
                budget: Array.isArray(parsed.budget) ? parsed.budget : [],
                tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
                totalBudget: Number(parsed.totalBudget) || 0
            };
        } catch (e) {
            return { guests: [], vendors: [], budget: [], tasks: [], totalBudget: 0 };
        }
    }

    function saveRoot(root) {
        localStorage.setItem(KEY, JSON.stringify(root));
    }

    function generateId(prefix) {
        return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
    }

    const api = {
        exportAll() {
            return loadRoot();
        },
        importAll(data) {
            saveRoot({
                guests: Array.isArray(data.guests) ? data.guests : [],
                vendors: Array.isArray(data.vendors) ? data.vendors : [],
                budget: Array.isArray(data.budget) ? data.budget : [],
                tasks: Array.isArray(data.tasks) ? data.tasks : [],
                totalBudget: Number(data.totalBudget) || 0
            });
        },
        clearAll() {
            saveRoot({ guests: [], vendors: [], budget: [], tasks: [], totalBudget: 0 });
        },

        // Guests
        getGuests() { return loadRoot().guests; },
        addGuest(guest) {
            const root = loadRoot();
            const newGuest = { id: generateId('g'), name: '', contact: '', side: 'Bride', rsvp: 'Pending', ...guest };
            root.guests.push(newGuest);
            saveRoot(root);
            return newGuest;
        },
        updateGuest(id, updates) {
            const root = loadRoot();
            root.guests = root.guests.map(g => g.id === id ? { ...g, ...updates } : g);
            saveRoot(root);
        },
        removeGuest(id) {
            const root = loadRoot();
            root.guests = root.guests.filter(g => g.id !== id);
            saveRoot(root);
        },

        // Vendors
        getVendors() { return loadRoot().vendors; },
        addVendor(vendor) {
            const root = loadRoot();
            const newVendor = { id: generateId('v'), name: '', category: '', contact: '', notes: '', ...vendor };
            root.vendors.push(newVendor);
            saveRoot(root);
            return newVendor;
        },
        updateVendor(id, updates) {
            const root = loadRoot();
            root.vendors = root.vendors.map(v => v.id === id ? { ...v, ...updates } : v);
            saveRoot(root);
        },
        removeVendor(id) {
            const root = loadRoot();
            root.vendors = root.vendors.filter(v => v.id !== id);
            saveRoot(root);
        },

        // Budget
        getBudgetItems() { return loadRoot().budget; },
        addBudgetItem(item) {
            const root = loadRoot();
            const newItem = { id: generateId('b'), name: '', planned: 0, actual: 0, ...item };
            root.budget.push(newItem);
            saveRoot(root);
            return newItem;
        },
        updateBudgetItem(id, updates) {
            const root = loadRoot();
            root.budget = root.budget.map(b => b.id === id ? { ...b, ...updates } : b);
            saveRoot(root);
        },
        removeBudgetItem(id) {
            const root = loadRoot();
            root.budget = root.budget.filter(b => b.id !== id);
            saveRoot(root);
        },

        // Tasks
        getTasks() { return loadRoot().tasks; },
        addTask(task) {
            const root = loadRoot();
            const newTask = { id: generateId('t'), name: '', due: '', done: false, ...task };
            root.tasks.push(newTask);
            saveRoot(root);
            return newTask;
        },
        updateTask(id, updates) {
            const root = loadRoot();
            root.tasks = root.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
            saveRoot(root);
        },
        removeTask(id) {
            const root = loadRoot();
            root.tasks = root.tasks.filter(t => t.id !== id);
            saveRoot(root);
        },

        // Total budget
        getTotalBudget() { return loadRoot().totalBudget || 0; },
        setTotalBudget(value) { const root = loadRoot(); root.totalBudget = Number(value)||0; saveRoot(root); }
    };

    window.CWPSStorage = api;
})();


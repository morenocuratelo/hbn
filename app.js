const App = {
    currentView: 'home',
    charts: {},
    docData: { mcq: [], prompts: [], promptMap: {}, answers: [], answerMap: {} },
    navIconMap: {
        home: 'dashboard',
        module1: 'account_balance_wallet',
        module3: 'public',
        module4: 'medication',
        review: 'quiz'
    },

    init() {
        if (!window.HBN_DATA) {
            console.error("HBN_DATA non trovato! Assicurati di aver caricato data.js prima di app.js");
            return;
        }
        this.cacheDom();
        this.prepareDocContent();
        this.renderNav();
        this.navigate('home');
    },

    cacheDom() {
        this.dom = {
            nav: document.getElementById('nav-container'),
            content: document.getElementById('main-content'),
            scroller: document.getElementById('main-scroll')
        };
    },

    smoothScrollToTop() {
        const target = this.dom?.scroller;
        if (target && typeof target.scrollTo === 'function') {
            target.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (typeof window.scrollTo === 'function') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    resetCharts() {
        if (!this.charts) return;
        Object.keys(this.charts).forEach(key => {
            const chart = this.charts[key];
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    },

    renderNav() {
        const container = (this.dom && this.dom.nav) || document.getElementById('nav-container');
        if (!container || !Array.isArray(HBN_DATA.nav)) return;
        this.dom.nav = container;
        container.innerHTML = HBN_DATA.nav.map(item => {
            const isActive = this.currentView === item.id;
            const icon = item.icon || this.navIconMap[item.id] || 'bookmark';
            const label = item.label ? item.label.split(':')[0] : 'Modulo';
            return `
                <button onclick="App.navigate('${item.id}')" 
                    class="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'}">
                    <span class="material-symbols-rounded text-xl ${isActive ? 'fill-current' : ''}">${icon}</span>
                    <span class="hidden lg:inline">${this.escapeHtml(label)}</span>
                </button>`;
        }).join('');
    },

    navigate(viewId) {
        if (!HBN_DATA[viewId]) return;
        this.currentView = viewId;
        this.renderNav();
        this.renderContent(viewId);
        this.smoothScrollToTop();
    },

    renderContent(viewId) {
        const main = (this.dom && this.dom.content) || document.getElementById('main-content');
        const data = HBN_DATA[viewId];
        if (!main || !data) return;
        this.dom.content = main;

        this.resetCharts();

        const docWidgets = [];
        const heroTitle = data.title || data.intro?.title || 'Human Behavioral Neuroscience';
        const heroSubtitle = data.subtitle || data.intro?.text || '';
        const heroVisual = data.heroImage || data.intro?.hero || '';
        const heroTag = viewId === 'home' ? 'Dashboard' : viewId === 'review' ? 'Revision Hub' : 'Module Overview';

        let html = '<div class="fade-enter space-y-12">';
        html += this.buildHeroSection(heroTitle, heroSubtitle, heroVisual, heroTag);

        if (viewId === 'home') {
            html += this.buildHomeGrid(data.cards || []);
        } else {
            if (Array.isArray(data.definitions) && data.definitions.length) {
                html += this.buildDefinitionRow(data.definitions, this.getAccentColor(data.intro?.color || 'teal'));
            }
            if (Array.isArray(data.sections)) {
                data.sections.forEach((section, idx) => {
                    html += this.renderModuleSection(viewId, section, idx, docWidgets, data);
                });
            }
        }

        html += '</div>';
        main.innerHTML = html;

        this.initCharts(viewId);
        docWidgets.forEach(init => init());
    },

    buildHeroSection(title = '', subtitle = '', image = '', tag = '') {
        const safeTitle = this.escapeHtml(title);
        const safeSubtitle = this.escapeHtml(subtitle);
        const safeTag = tag ? this.escapeHtml(tag) : '';
        const imageSrc = image ? this.escapeHtml(image) : '';
        const mediaLayer = imageSrc
            ? `<img src="${imageSrc}" class="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="${safeTitle}">`
            : '<div class="w-full h-full bg-gradient-to-br from-indigo-600 via-slate-900 to-slate-900"></div>';
        return `
            <section class="relative w-full h-48 md:h-64 lg:h-80 rounded-3xl overflow-hidden shadow-lg group">
                ${mediaLayer}
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                    ${safeTag ? `<span class="text-indigo-400 font-bold tracking-wider uppercase text-xs mb-2">${safeTag}</span>` : ''}
                    <h1 class="text-3xl md:text-5xl font-display font-bold text-white mb-2 leading-tight">${safeTitle}</h1>
                    ${safeSubtitle ? `<p class="text-slate-200 max-w-2xl text-sm md:text-base opacity-90">${safeSubtitle}</p>` : ''}
                </div>
            </section>`;
    },

    buildHomeGrid(cards = []) {
        if (!Array.isArray(cards) || !cards.length) {
            return '<section class="mt-8 text-sm text-slate-500">Nessuna card configurata.</section>';
        }
        return `
            <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                ${cards.map(card => {
                    const accent = this.getAccentColor(card.color || 'teal');
                    const icon = this.escapeHtml(card.icon || 'neurology');
                    const image = card.img ? `
                        <div class="h-32 rounded-xl overflow-hidden mt-auto">
                            <img src="${this.escapeHtml(card.img)}" alt="${this.escapeHtml(card.title || 'Anteprima modulo')}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                        </div>` : '';
                    return `
                        <article onclick="App.navigate('${card.id}')" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-br from-${accent}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative z-10 flex flex-col h-full">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="w-12 h-12 rounded-2xl bg-${accent}-100 text-${accent}-600 flex items-center justify-center">
                                        <span class="material-symbols-rounded text-2xl">${icon}</span>
                                    </div>
                                    <span class="material-symbols-rounded text-slate-300 group-hover:text-${accent}-500 transition-colors">arrow_forward</span>
                                </div>
                                <h3 class="text-xl font-bold text-slate-800 mb-2 font-display">${this.escapeHtml(card.title)}</h3>
                                <p class="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">${this.escapeHtml(card.desc)}</p>
                                ${image || `<div class="h-2 rounded-full bg-slate-100 overflow-hidden mt-auto"><div class="h-full bg-${accent}-400 w-2/3"></div></div>`}
                            </div>
                        </article>`;
                }).join('')}
            </section>`;
    },

    buildDefinitionRow(definitions = [], accent = 'teal') {
        if (!definitions.length) return '';
        return `
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${definitions.map(def => `
                    <article class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-${accent}-200 transition-colors">
                        <div class="text-xs font-bold text-${accent}-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-${accent}-500"></span> Definition
                        </div>
                        <h4 class="text-lg font-bold text-slate-800 mb-2 font-display">${this.escapeHtml(def.title)}</h4>
                        <p class="text-sm text-slate-600 leading-relaxed">${this.escapeHtml(def.text)}</p>
                    </article>`).join('')}
            </section>`;
    },

    buildSectionHeading(title = '') {
        if (!title) return '';
        return `
            <div class="flex items-center gap-4 mb-6">
                <div class="h-px bg-slate-200 flex-1"></div>
                <h2 class="text-2xl font-bold text-slate-800 font-display text-center">${this.escapeHtml(title)}</h2>
                <div class="h-px bg-slate-200 flex-1"></div>
            </div>`;
    },

    renderModuleSection(viewId, section, idx, docWidgets, parentData = {}) {
        if (!section) return '';
        const heading = this.buildSectionHeading(section.title || `Sezione ${idx + 1}`);
        const accent = this.getAccentColor(section.accent || parentData.intro?.color || 'teal');
        const wikiFooter = this.renderWikiFooter(viewId, idx, section.wiki || section.ids, docWidgets);
        let body = '';

        switch (section.type) {
            case 'question-browser': {
                const containerId = `${viewId}-qb-${idx}`;
                const moduleOptions = ['<option value="all">Tutti i moduli</option>'];
                this.docData.mcq.forEach((mod, mIdx) => moduleOptions.push(`<option value="${mIdx}">${this.escapeHtml(mod.title)}</option>`));
                body = `
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10" id="${containerId}">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        ${this.docData.mcq.length === 0 ? '<p class="text-sm text-slate-500">Documento non disponibile.</p>' : `
                        <div class="flex flex-col lg:flex-row gap-4 mb-4">
                            <select data-role="module-select" class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none">
                                ${moduleOptions.join('')}
                            </select>
                            <input data-role="search-input" type="search" placeholder="Filtra per parola chiave" class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" />
                        </div>
                        <div data-role="result-count" class="text-xs uppercase tracking-wide text-slate-400 mb-2"></div>
                        <div data-role="result-list" class="space-y-4 max-h-[70vh] overflow-y-auto pr-1"></div>`}
                    </div>
                    ${wikiFooter}`;
                docWidgets.push(() => this.mountQuestionBrowser(containerId));
                break;
            }
            case 'prompt-explorer': {
                const containerId = `${viewId}-pe-${idx}`;
                const promptOptions = ['<option value="all">Tutti i moduli</option>'];
                this.docData.prompts.forEach((mod, mIdx) => promptOptions.push(`<option value="${mIdx}">${this.escapeHtml(mod.title)}</option>`));
                body = `
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10" id="${containerId}">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        ${this.docData.prompts.length === 0 ? '<p class="text-sm text-slate-500">Documento non disponibile.</p>' : `
                        <div class="flex flex-col lg:flex-row gap-4 mb-4">
                            <select data-role="module-select" class="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none">
                                ${promptOptions.join('')}
                            </select>
                            <input data-role="search-input" type="search" placeholder="Filtra per keyword" class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" />
                        </div>
                        <div data-role="result-count" class="text-xs uppercase tracking-wide text-slate-400 mb-2"></div>
                        <ul data-role="result-list" class="space-y-3 max-h-[60vh] overflow-y-auto pr-1"></ul>
                        <div data-role="detail-panel" class="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600" hidden></div>`}
                    </div>
                    ${wikiFooter}`;
                docWidgets.push(() => this.mountPromptExplorer(containerId));
                break;
            }
            case 'mixed-content': {
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-8 text-lg">${section.desc}</p>` : ''}
                        <div class="flex flex-col lg:flex-row gap-10 items-center">
                            <div class="w-full lg:w-3/5 h-64 lg:h-80 relative">
                                <canvas id="${section.chartId}"></canvas>
                            </div>
                            ${Array.isArray(section.textBlocks) ? `<div class="w-full lg:w-2/5 space-y-4">
                                ${section.textBlocks.map(tb => `
                                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition">
                                        <h5 class="font-bold text-${accent}-600 text-sm mb-1 uppercase tracking-wide">${tb.title}</h5>
                                        <p class="text-sm text-slate-600 leading-relaxed">${tb.text}</p>
                                    </div>`).join('')}
                            </div>` : ''}
                        </div>
                        ${section.chartCaption ? `<p class="text-xs text-slate-400 text-center mt-4">${section.chartCaption}</p>` : ''}
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'chart-section': {
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-8 text-lg">${section.desc}</p>` : ''}
                        <div class="w-full h-64 lg:h-80">
                            <canvas id="${section.chartId}"></canvas>
                        </div>
                        ${section.chartCaption ? `<p class="text-xs text-slate-400 text-center mt-4">${section.chartCaption}</p>` : ''}
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'process-flow': {
                const steps = Array.isArray(section.steps) ? section.steps : [];
                const orientation = section.orientation === 'vertical' ? 'vertical' : 'horizontal';
                const layoutClass = orientation === 'vertical'
                    ? 'flex flex-col gap-4'
                    : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4';
                const processCards = steps.length
                    ? steps.map((step, stepIdx) => `
                        <article class="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm h-full">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-2xl bg-${accent}-100 text-${accent}-700 font-bold flex items-center justify-center">${stepIdx + 1}</div>
                                <h4 class="text-base font-semibold text-slate-800">${this.escapeHtml(step.title || `Fase ${stepIdx + 1}`)}</h4>
                            </div>
                            <p class="text-sm text-slate-600 leading-relaxed">${this.escapeHtml(step.detail || '')}</p>
                        </article>`).join('')
                    : '<p class="text-sm text-slate-500">Nessun passaggio definito.</p>';
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div class="${layoutClass}">
                            ${processCards}
                        </div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'grid-cards': {
                const gridCols = section.items && section.items.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2';
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-6">${section.desc}</p>` : ''}
                        <div class="grid grid-cols-1 ${gridCols} gap-4">
                            ${Array.isArray(section.items) ? section.items.map(item => `
                                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition">
                                    <div class="text-3xl mb-3">${this.escapeHtml(item.icon || '•')}</div>
                                    <h4 class="font-bold text-slate-800 mb-2">${this.escapeHtml(item.title)}</h4>
                                    <p class="text-sm text-slate-600 leading-relaxed">${this.escapeHtml(item.text)}</p>
                                </div>`).join('') : '<p class="text-sm text-slate-500">Nessun contenuto.</p>'}
                        </div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'accordion-group': {
                const items = Array.isArray(section.items) ? section.items : [];
                const accordionContent = items.length
                    ? items.map((item, itemIdx) => `
                        <details class="group border border-slate-200 rounded-2xl bg-slate-50 p-4">
                            <summary class="cursor-pointer text-slate-800 font-semibold flex items-center justify-between gap-4">
                                <span>${this.escapeHtml(item.title || `Voce ${itemIdx + 1}`)}</span>
                                <span class="text-xs text-slate-400">Apri</span>
                            </summary>
                            <p class="mt-3 text-sm text-slate-600 leading-relaxed">${this.escapeHtml(item.detail || '')}</p>
                        </details>`).join('')
                    : '<p class="text-sm text-slate-500">Nessun elemento disponibile.</p>';
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div class="space-y-3">${accordionContent}</div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'interactive-list': {
                const items = Array.isArray(section.items) ? section.items : [];
                const interactiveContent = items.length
                    ? items.map(item => `
                        <article class="bg-${accent}-50 border border-${accent}-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                            <div class="flex items-center justify-between gap-3 mb-2">
                                <h4 class="text-base font-semibold text-slate-800">${this.escapeHtml(item.title || 'Voce')}</h4>
                                ${item.summary ? `<span class="text-xs font-semibold text-${accent}-700 bg-white/80 px-2 py-0.5 rounded-full border border-${accent}-200">${this.escapeHtml(item.summary)}</span>` : ''}
                            </div>
                            <p class="text-sm text-slate-600 leading-relaxed">${this.escapeHtml(item.detail || '')}</p>
                        </article>`).join('')
                    : '<p class="text-sm text-slate-500">Nessuna voce configurata.</p>';
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div class="space-y-4">${interactiveContent}</div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'text-block': {
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-500 mb-4">${section.desc}</p>` : ''}
                        <div class="prose prose-stone max-w-none">${section.content || ''}</div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'tabs-content': {
                const tabs = Array.isArray(section.tabs) ? section.tabs : [];
                body = `
                    <div class="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div class="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
                            ${tabs.map((tab, tIdx) => {
                                const active = tIdx === 0;
                                return `<button onclick="App.switchTab('${viewId}', ${idx}, ${tIdx})" id="tab-btn-${idx}-${tIdx}" class="text-sm font-medium px-4 py-2 rounded-full transition-all ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">${tab.label}</button>`;
                            }).join('')}
                        </div>
                        <div id="tab-content-${idx}" class="mt-6 bg-slate-50 rounded-2xl p-6 text-sm text-slate-700 leading-relaxed">
                            ${(tabs[0] && tabs[0].content) || '<p>Contenuto non disponibile.</p>'}
                        </div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'interactive-brain': {
                const nodes = Array.isArray(section.nodes) ? section.nodes : [];
                const groupId = `${viewId}-${idx}`;
                const markers = nodes.length ? nodes.map((node, nIdx) => {
                    const posX = Number(node.x); const posY = Number(node.y);
                    const left = Number.isFinite(posX) ? posX : 50;
                    const top = Number.isFinite(posY) ? posY : 50;
                    return `
                        <button type="button" class="brain-node brain-node-marker absolute w-6 h-6 rounded-full border-2 border-white" data-node-group="${groupId}" id="node-${groupId}-${nIdx}" aria-label="${this.escapeHtml(node.label)}" onclick="App.selectBrainNode('${viewId}', ${idx}, ${nIdx})" style="left:${left}%; top:${top}%; transform: translate(-50%, -50%);">
                            <span class="sr-only">${this.escapeHtml(node.label)}</span>
                        </button>`;
                }).join('') : '<div class="absolute inset-0 flex items-center justify-center text-white/70 text-sm text-center px-6">Nessun nodo configurato.</div>';
                const placeholder = `
                    <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <span class="material-symbols-rounded text-slate-400">touch_app</span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-400">Interattivo</h3>
                    <p class="text-slate-500 mt-2">Clicca sui nodi del cervello per visualizzare le funzioni specifiche di ogni area.</p>`;
                body = `
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[560px] lg:h-[500px]">
                        <div class="relative w-full lg:w-2/3 bg-slate-900">
                            <img src="/gen?prompt=schematic+human+brain+profile+view+medical+blue+wireframe+dark+background&aspect=4:3" class="w-full h-full object-cover opacity-40 mix-blend-screen" alt="Schema cerebrale">
                            ${markers}
                        </div>
                        <div class="w-full lg:w-1/3 p-8 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-slate-100 relative">
                            <div id="brain-panel-${groupId}" class="flex-1 flex flex-col justify-center space-y-4">
                                ${placeholder}
                            </div>
                        </div>
                    </div>
                    ${wikiFooter}`;
                break;
            }
            case 'study-guide': {
                const ids = Array.isArray(section.ids) ? section.ids.filter(Boolean) : [];
                const answers = ids.map(id => this.docData.answerMap[id]).filter(Boolean);
                const missing = ids.filter(id => !this.docData.answerMap[id]);
                const cards = answers.length
                    ? answers.map(answer => `
                        <article class="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                            <div class="flex items-baseline justify-between gap-3 mb-3">
                                <h4 class="text-base font-semibold text-slate-800">${this.escapeHtml(answer.title)}</h4>
                                <span class="text-[11px] font-semibold tracking-wide uppercase text-${accent}-600">${this.escapeHtml(answer.id)}</span>
                            </div>
                            <div class="prose prose-stone max-w-none text-sm leading-relaxed">${this.formatAnswerText(answer.body)}</div>
                        </article>`).join('')
                    : '<p class="text-sm text-slate-500">Nessuna risposta disponibile per gli ID indicati.</p>';
                body = `
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div class="space-y-4">${cards}</div>
                        ${missing.length ? `<p class="text-xs text-amber-600 mt-4">Attenzione: non sono state trovate risposte per ${missing.map(id => this.escapeHtml(id)).join(', ')}.</p>` : ''}
                        ${wikiFooter}
                    </div>`;
                break;
            }
            case 'question-list': {
                const containerId = `${viewId}-ql-${idx}`;
                const moduleRef = section.moduleRef || section.module || section.moduleTitle || '';
                body = `
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div id="${containerId}" data-module="${this.escapeHtml(moduleRef)}" class="space-y-4">
                            <p class="text-xs text-slate-400">Caricamento domande...</p>
                        </div>
                        ${wikiFooter}
                    </div>`;
                docWidgets.push(() => this.mountQuestionList(containerId, moduleRef, accent));
                break;
            }
            case 'exam-checklist': {
                const questions = Array.isArray(section.questions) ? section.questions.filter(q => q && q.id && q.text) : [];
                const containerId = `${viewId}-ex-${idx}`;
                const scopeLabel = section.moduleRef ? `<div class="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">Focus: ${this.escapeHtml(section.moduleRef)}</div>` : '';
                if (!questions.length) {
                    body = `
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10">
                            ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                            ${scopeLabel}
                            <p class="text-sm text-slate-500">Nessuna domanda configurata per questa checklist.</p>
                            ${wikiFooter}
                        </div>`;
                } else {
                    body = `
                        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10">
                            ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                            ${scopeLabel}
                            <div id="${containerId}"></div>
                            ${wikiFooter}
                        </div>`;
                    docWidgets.push(() => this.mountExamChecklist(containerId, questions, accent, section.moduleRef || viewId));
                }
                break;
            }
            case 'qa-accordion': {
                const qaModules = this.getAnswerModules(section.sources);
                const qaContent = qaModules.length ? qaModules.map(module => {
                    const answerItems = module.answers.map(answer => `
                        <details class="group border border-slate-200 rounded-2xl p-4 bg-slate-50 transition">
                            <summary class="flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer text-slate-800 font-semibold">
                                <span>${this.escapeHtml(answer.title)}</span>
                                <span class="text-xs font-bold text-rose-600 mt-1 sm:mt-0">${this.escapeHtml(answer.id)}</span>
                            </summary>
                            <div class="mt-3 text-sm text-slate-600 leading-relaxed">${this.formatAnswerText(answer.body)}</div>
                        </details>`).join('');
                    return `
                        <div class="space-y-4">
                            <div class="flex items-baseline justify-between">
                                <h4 class="text-lg font-semibold text-slate-900">${this.escapeHtml(module.title)}</h4>
                                <span class="text-xs uppercase tracking-wide text-slate-400">${module.answers.length} risposte</span>
                            </div>
                            ${answerItems || '<p class="text-sm text-slate-500">Nessuna risposta disponibile.</p>'}
                        </div>`;
                }).join('') : '<p class="text-sm text-slate-500">Documento Q&A non disponibile.</p>';
                body = `
                    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-10">
                        ${section.desc ? `<p class="text-slate-600 mb-4">${section.desc}</p>` : ''}
                        <div class="space-y-6">${qaContent}</div>
                        ${wikiFooter}
                    </div>`;
                break;
            }
            default: {
                body = '<div class="text-sm text-slate-500">Sezione non supportata.</div>';
            }
        }

        return `<section class="mt-12">${heading}${body}</section>`;
    },

    // Interaction Handlers
    selectBrainNode(viewId, sectionIdx, nodeIdx) {
        const section = HBN_DATA[viewId]?.sections?.[sectionIdx];
        if (!section || !Array.isArray(section.nodes)) return;
        const node = section.nodes[nodeIdx];
        if (!node) return;

        const accent = this.getAccentColor(section.accent || HBN_DATA[viewId]?.intro?.color || 'teal');
        const groupId = `${viewId}-${sectionIdx}`;

        document.querySelectorAll(`[data-node-group="${groupId}"]`).forEach(el => {
            el.classList.remove('active');
            el.setAttribute('aria-pressed', 'false');
        });

        const current = document.getElementById(`node-${groupId}-${nodeIdx}`);
        if (current) {
            current.classList.add('active');
            current.setAttribute('aria-pressed', 'true');
        }

        const panel = document.getElementById(`brain-panel-${groupId}`);
        if (panel) {
            panel.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <p class="text-xs uppercase tracking-wide text-${accent}-500 font-semibold mb-1">${this.escapeHtml(node.sub || 'Focus')}</p>
                        <h4 class="text-2xl font-bold text-slate-900 leading-tight">${this.escapeHtml(node.label)}</h4>
                    </div>
                    <p class="text-slate-600 text-base leading-relaxed">${this.escapeHtml(node.text || '')}</p>
                    ${node.meta ? `<div class="pt-4 border-t border-slate-200">
                        <span class="text-xs font-semibold text-${accent}-600 uppercase tracking-wide">Fonte</span>
                        <p class="text-sm text-slate-500 mt-1">${this.escapeHtml(node.meta)}</p>
                    </div>` : ''}
                </div>`;
        }
    },

    switchTab(viewId, sectionIdx, tabIdx) {
        const section = HBN_DATA[viewId]?.sections?.[sectionIdx];
        const tab = section?.tabs?.[tabIdx];
        if (!tab) return;

        const contentEl = document.getElementById(`tab-content-${sectionIdx}`);
        if (contentEl) {
            contentEl.innerHTML = tab.content;
        }

        const buttons = document.querySelectorAll(`[id^="tab-btn-${sectionIdx}-"]`);
        buttons.forEach((btn, idx) => {
            btn.className = `text-sm font-medium px-4 py-2 rounded-full transition-all ${idx === tabIdx ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
        });
    },

    prepareDocContent() {
        try {
            const promptData = this.parseOpenPrompts(window.DOC_DOMANDE || '');
            const mergedAnswers = this.mergeAnswerSources([
                this.parseAnswersDoc(window.DOC_ANSWERS || ''),
                this.parseAnswersDoc(window.DOC_ANSWERED || '')
            ]);
            this.docData = {
                mcq: this.parseRipassoDoc(window.DOC_RIPASSO || ''),
                prompts: promptData.modules,
                promptMap: promptData.map,
                answers: mergedAnswers.modules,
                answerMap: mergedAnswers.map
            };
        } catch (error) {
            console.warn('Impossibile parsare i documenti di ripasso:', error);
            this.docData = { mcq: [], prompts: [], promptMap: {}, answers: [], answerMap: {} };
        }
        this.validateWikiReferences();
    },

    parseOpenPrompts(text) {
        if (!text) return { modules: [], map: {} };
        const lines = text.replace(/\r\n/g, '\n').split('\n');
        const modules = [];
        const map = {};
        let current = null;
        lines.forEach(line => {
            if (line.startsWith('## ')) {
                const title = line.replace(/^##\s*/, '').trim();
                if (!title) return;
                current = { title, prompts: [] };
                modules.push(current);
            } else if (current && line.trim().startsWith('- ')) {
                const rawPrompt = line.trim().slice(2).trim();
                if (!rawPrompt) return;
                const idMatch = rawPrompt.match(/\(ID:\s*([^\)]+)\)\s*$/i);
                const id = idMatch ? idMatch[1].trim() : null;
                const textOnly = id ? rawPrompt.replace(/\(ID:[^\)]+\)\s*$/i, '').trim() : rawPrompt;
                const entry = { text: textOnly, id, raw: rawPrompt };
                current.prompts.push(entry);
                if (id && !map[id]) {
                    map[id] = { ...entry, module: current.title };
                }
            }
        });
        const filtered = modules.filter(m => m.prompts.length);
        return { modules: filtered, map };
    },

    parseRipassoDoc(text) {
        if (!text) return [];
        const normalized = text.replace(/\r\n/g, '\n');
        const sections = [];
        const headingRegex = /__([^_]+)__/g;
        let match;
        let lastTitle = null;
        let lastIndex = 0;
        while ((match = headingRegex.exec(normalized)) !== null) {
            if (lastTitle !== null) {
                sections.push({ title: lastTitle, content: normalized.slice(lastIndex, match.index) });
            }
            lastTitle = match[1].trim();
            lastIndex = headingRegex.lastIndex;
        }
        if (lastTitle !== null) {
            sections.push({ title: lastTitle, content: normalized.slice(lastIndex) });
        }

        const modules = [];
        let current = null;
        sections.forEach(section => {
            if (this.isTopLevelHeading(section.title)) {
                current = { title: section.title, raw: section.content };
                modules.push(current);
            } else if (current) {
                current.raw += `\n__${section.title}__\n${section.content}`;
            }
        });

        return modules
            .map(module => this.extractQuestionsFromModule(module.title, module.raw))
            .filter(module => module.questions.length);
    },

    isTopLevelHeading(title) {
        return /^(Modulo|Neuroeconomics|Neurobiological|RCTs|Integrated)/i.test(title);
    },

    extractQuestionsFromModule(title, rawContent = '') {
        const segments = rawContent.split(/__Answer Key[^_]*__/i);
        const questionPart = segments[0] || '';
        const answerPart = segments.slice(1).join('\n');
        const answers = {};
        answerPart.replace(/(Q\d+\.\d+)\s*:\s*([A-D])/g, (_, code, ans) => {
            answers[code] = ans;
            return '';
        });

        const cleaned = questionPart.replace(/__[^_]+__/g, '\n');
        const blocks = cleaned.matchAll(/(Q\d+\.\d+)\s+([\s\S]*?)(?=Q\d+\.\d+|$)/g);
        const questions = [];
        for (const block of blocks) {
            const id = block[1].trim();
            let body = (block[2] || '').trim();
            if (!body) continue;
            const lines = body.split('\n').map(line => line.trim());
            let idx = 0;
            const promptParts = [];
            while (idx < lines.length) {
                const line = lines[idx];
                if (!line) {
                    idx++;
                    continue;
                }
                if (/^[A-D]\./.test(line)) break;
                promptParts.push(line);
                idx++;
            }
            const options = [];
            let currentOpt = null;
            for (; idx < lines.length; idx++) {
                const line = lines[idx];
                if (!line) continue;
                if (/^[A-D]\./.test(line)) {
                    if (currentOpt) options.push(currentOpt);
                    currentOpt = { label: line.charAt(0), text: line.slice(2).trim() };
                } else if (currentOpt) {
                    currentOpt.text += ' ' + line;
                }
            }
            if (currentOpt) options.push(currentOpt);
            if (!promptParts.length && !options.length) continue;
            questions.push({
                id,
                prompt: promptParts.join(' ').trim(),
                options,
                answer: answers[id] || null
            });
        }
        return { title, questions };
    },

    parseAnswersDoc(text) {
        if (!text) return { modules: [], map: {} };
        const normalized = text.replace(/\r\n/g, '\n');
        const modules = [];
        const map = {};
        const firstModuleIdx = normalized.search(/^##\s+(?!#)/m);
        if (firstModuleIdx === -1) return { modules, map };
        const trimmed = `\n${normalized.slice(firstModuleIdx).trim()}`;
        const chunks = trimmed.split(/\n(?=##\s+(?!#))/).map(chunk => chunk.trim()).filter(Boolean);
        chunks.forEach(chunk => {
            const lines = chunk.split('\n');
            const header = lines.shift();
            const headerMatch = header ? header.match(/^##\s+(?!#)(.+)$/) : null;
            if (!headerMatch) return;
            const moduleTitle = headerMatch[1].trim();
            const body = lines.join('\n').trim();
            if (!body) return;
            const answers = [];
            const questionMatches = Array.from(body.matchAll(/^###\s+(.+?)\s*\(ID:\s*([^\)]+)\)/gm));
            questionMatches.forEach((match, idx) => {
                const questionTitle = match[1].trim();
                const id = match[2].trim();
                if (!id) return;
                const start = match.index + match[0].length;
                const end = idx + 1 < questionMatches.length ? questionMatches[idx + 1].index : body.length;
                const answerBody = body.slice(start, end).trim();
                const answerEntry = { id, title: questionTitle, body: answerBody, module: moduleTitle };
                answers.push(answerEntry);
                if (!map[id]) map[id] = answerEntry;
            });
            if (answers.length) modules.push({ title: moduleTitle, answers });
        });
        return { modules, map };
    },

    mergeAnswerSources(sources = []) {
        const moduleOrder = [];
        const moduleMap = new Map();
        const answerMap = {};

        sources.forEach(source => {
            if (!source || !Array.isArray(source.modules)) return;
            source.modules.forEach(module => {
                const key = module.title ? module.title.trim().toLowerCase() : '';
                if (!key || !Array.isArray(module.answers)) return;
                if (!moduleMap.has(key)) {
                    moduleMap.set(key, { title: module.title, answers: [] });
                    moduleOrder.push(key);
                }
                const targetModule = moduleMap.get(key);
                module.answers.forEach(answer => {
                    if (!answer || !answer.id) return;
                    const normalizedId = answer.id.trim();
                    const enrichedAnswer = { ...answer, module: module.title };
                    const existing = answerMap[normalizedId];
                    if (!existing || (enrichedAnswer.body || '').length > (existing.body || '').length) {
                        answerMap[normalizedId] = enrichedAnswer;
                    }
                    const entryIndex = targetModule.answers.findIndex(item => item && item.id === normalizedId);
                    if (entryIndex === -1) {
                        targetModule.answers.push(answerMap[normalizedId]);
                    } else {
                        targetModule.answers[entryIndex] = answerMap[normalizedId];
                    }
                });
            });
        });

        const modules = moduleOrder.map(key => {
            const module = moduleMap.get(key);
            module.answers = module.answers.filter((answer, idx, arr) => answer && arr.findIndex(item => item && item.id === answer.id) === idx);
            return module;
        }).filter(module => module.answers.length);

        return { modules, map: answerMap };
    },

    validateWikiReferences() {
        if (!window.HBN_DATA || !this.docData) return;
        const missing = new Set();
        Object.keys(window.HBN_DATA).forEach(key => {
            const sections = window.HBN_DATA[key]?.sections;
            if (!Array.isArray(sections)) return;
            sections.forEach(section => {
                const wikiList = Array.isArray(section.wiki) ? section.wiki : [];
                wikiList.forEach(id => {
                    if (!id) return;
                    const normalized = id.trim();
                    if (!this.docData.promptMap[normalized] && !this.docData.answerMap[normalized]) {
                        missing.add(normalized);
                    }
                });
            });
        });
        if (missing.size) {
            console.warn('Wiki IDs senza corrispondenza nei documenti:', Array.from(missing));
        }
    },

    getPromptsByModule(moduleRef) {
        if (!moduleRef || !Array.isArray(this.docData.prompts)) return [];
        const key = this.normalizeModuleKey(moduleRef);
        if (!key) return [];
        const entry = this.docData.prompts.find(module => this.normalizeModuleKey(module.title) === key);
        if (!entry) return [];
        return entry.prompts.map(prompt => ({ ...prompt, module: entry.title }));
    },

    normalizeModuleKey(value) {
        if (!value && value !== 0) return '';
        return value.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    },

    getAccentColor(value) {
        const allowed = new Set(['teal', 'violet', 'amber', 'rose', 'emerald', 'sky', 'stone']);
        return allowed.has(value) ? value : 'teal';
    },

    mountQuestionBrowser(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.docData.mcq.length) return;
        const select = container.querySelector('[data-role="module-select"]');
        const searchInput = container.querySelector('[data-role="search-input"]');
        const listEl = container.querySelector('[data-role="result-list"]');
        const countEl = container.querySelector('[data-role="result-count"]');
        const render = () => {
            const sel = select.value;
            const query = (searchInput.value || '').toLowerCase();
            const modules = sel === 'all' ? this.docData.mcq : [this.docData.mcq[Number(sel)]].filter(Boolean);
            const questions = [];
            modules.forEach(module => {
                module.questions.forEach(q => questions.push({ ...q, module: module.title }));
            });
            const filtered = questions.filter(q => {
                if (!query) return true;
                const haystack = `${q.id} ${q.prompt} ${q.options.map(opt => opt.text).join(' ')}`.toLowerCase();
                return haystack.includes(query);
            });
            countEl.textContent = `${filtered.length} domande`;
            if (!filtered.length) {
                listEl.innerHTML = `<p class="text-sm text-slate-500">Nessun risultato trovato.</p>`;
                return;
            }
            listEl.innerHTML = filtered.map(q => `
                <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                    <div class="text-xs uppercase tracking-wide text-slate-400 mb-2">${this.escapeHtml(q.module)}</div>
                    <h4 class="font-semibold text-slate-800 mb-3">${this.escapeHtml(q.id)} &middot; ${this.escapeHtml(q.prompt)}</h4>
                    <ul class="space-y-1 text-sm text-slate-700 mb-2">
                        ${q.options.map(opt => `<li><span class="font-semibold text-slate-600">${this.escapeHtml(opt.label)}.</span> ${this.escapeHtml(opt.text)}</li>`).join('')}
                    </ul>
                    <div class="text-xs font-semibold text-teal-600">Risposta corretta: ${q.answer ? this.escapeHtml(q.answer) : 'n.d.'}</div>
                </div>
            `).join('');
        };
        select.addEventListener('change', render);
        searchInput.addEventListener('input', render);
        render();
    },

    mountQuestionList(containerId, moduleRef, accent = 'teal') {
        const container = document.getElementById(containerId);
        if (!container) return;
        const prompts = this.getPromptsByModule(moduleRef);
        if (!prompts.length) {
            container.innerHTML = '<p class="text-sm text-slate-500">Non sono state trovate domande per questo modulo.</p>';
            return;
        }

        const accentClass = this.getAccentColor(accent);
        const searchId = `${containerId}-search`;
        const listId = `${containerId}-list`;
        const detailId = `${containerId}-detail`;

        container.innerHTML = `
            <div class="flex flex-col gap-4">
                <div class="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                    <div class="text-xs uppercase tracking-wide text-slate-400 font-semibold">${prompts.length} domande totali</div>
                    <div class="flex items-center gap-2 w-full lg:w-1/2">
                        <span class="material-symbols-rounded text-slate-400">search</span>
                        <input id="${searchId}" type="search" placeholder="Filtra per parola chiave o ID" class="flex-1 border border-slate-200 rounded-2xl px-4 py-2 text-sm focus:outline-none">
                    </div>
                </div>
                <ul id="${listId}" class="space-y-3"></ul>
                <div id="${detailId}" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600" hidden></div>
            </div>`;

        const listEl = document.getElementById(listId);
        const searchInput = document.getElementById(searchId);
        const detailPanel = document.getElementById(detailId);

        const renderList = () => {
            const query = (searchInput.value || '').toLowerCase();
            const filtered = prompts.filter(item => {
                if (!query) return true;
                return (item.text || '').toLowerCase().includes(query) || (item.id || '').toLowerCase().includes(query);
            });
            if (!filtered.length) {
                listEl.innerHTML = '<li class="text-sm text-slate-500">Nessuna domanda corrisponde al filtro.</li>';
                return;
            }
            listEl.innerHTML = filtered.map(item => {
                const hasAnswer = item.id && this.docData.answerMap[item.id];
                const idChip = item.id ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-${accentClass}-50 text-${accentClass}-700 border border-${accentClass}-200">${this.escapeHtml(item.id)}</span>` : '';
                const action = item.id
                    ? (hasAnswer
                        ? `<button type="button" data-role="ql-answer" data-id="${this.escapeHtml(item.id)}" class="text-xs font-semibold text-${accentClass}-700 hover:text-${accentClass}-900">Apri risposta →</button>`
                        : '<span class="text-xs text-slate-400">Risposta non disponibile</span>')
                    : '<span class="text-xs text-slate-400">ID mancante</span>';
                return `
                    <li class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                        <p class="text-sm text-slate-700 leading-relaxed">${this.escapeHtml(item.text)}</p>
                        <div class="flex items-center justify-between">${idChip}${action}</div>
                    </li>`;
            }).join('');
        };

        const showAnswer = (id) => {
            if (!detailPanel) return;
            const answer = this.docData.answerMap[id];
            const prompt = this.docData.promptMap[id];
            if (!answer) {
                detailPanel.innerHTML = `<p class="text-sm text-slate-500">Nessuna risposta trovata per ${this.escapeHtml(id)}.</p>`;
                detailPanel.hidden = false;
                return;
            }
            detailPanel.innerHTML = `
                <div class="text-xs uppercase tracking-wide text-slate-400 mb-1">${this.escapeHtml(answer.module || moduleRef || 'Ripasso')}</div>
                <h4 class="text-lg font-semibold text-slate-800 mb-2">${this.escapeHtml(answer.title)}</h4>
                ${prompt ? `<p class="text-sm text-slate-600 mb-3">Domanda: ${this.escapeHtml(prompt.text)}</p>` : ''}
                <div class="prose prose-stone max-w-none text-sm">${this.formatAnswerText(answer.body)}</div>`;
            detailPanel.hidden = false;
        };

        listEl.addEventListener('click', event => {
            if (!(event.target instanceof Element)) return;
            const btn = event.target.closest('[data-role="ql-answer"]');
            if (!btn) return;
            event.preventDefault();
            showAnswer(btn.dataset.id);
        });

        searchInput.addEventListener('input', renderList);
        renderList();
    },

    mountExamChecklist(containerId, questions = [], accent = 'teal', scopeKey = 'global') {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!questions.length) {
            container.innerHTML = '<p class="text-sm text-slate-500">Checklist vuota.</p>';
            return;
        }

        const accentClass = this.getAccentColor(accent);
        const normalizedKey = this.normalizeModuleKey(scopeKey) || 'global';
        const storageKey = `hbn-checklist-${normalizedKey}`;
        const loadState = () => {
            if (typeof window === 'undefined' || !window.localStorage) return [];
            try {
                const raw = window.localStorage.getItem(storageKey);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        };
        const persistState = (ids) => {
            if (typeof window === 'undefined' || !window.localStorage) return;
            try {
                window.localStorage.setItem(storageKey, JSON.stringify(ids));
            } catch {
                /* ignore quota errors */
            }
        };

        const validIds = new Set(questions.map(q => q.id));
        let completed = new Set(loadState().filter(id => validIds.has(id)));

        container.innerHTML = `
            <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div class="text-xs uppercase tracking-wide text-slate-400 font-semibold">${questions.length} domande totali</div>
                <button type="button" data-role="checklist-reset" class="text-xs font-semibold text-${accentClass}-700 hover:text-${accentClass}-900">Reset progress</button>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-${accentClass}-500 transition-all" data-role="progress-bar" style="width:0%"></div>
            </div>
            <p class="text-sm text-slate-600 mt-2" data-role="progress-label"></p>
            <ul class="mt-4 space-y-3" data-role="checklist-list"></ul>`;

        const listEl = container.querySelector('[data-role="checklist-list"]');
        const progressBar = container.querySelector('[data-role="progress-bar"]');
        const progressLabel = container.querySelector('[data-role="progress-label"]');
        const resetBtn = container.querySelector('[data-role="checklist-reset"]');
        if (!listEl || !progressBar || !progressLabel) {
            container.innerHTML = '<p class="text-sm text-slate-500">Impossibile renderizzare la checklist.</p>';
            return;
        }

        const renderList = () => {
            listEl.innerHTML = questions.map((question, idx) => {
                const inputId = `${containerId}-item-${idx}`;
                const isChecked = completed.has(question.id);
                return `
                    <li class="border border-slate-200 rounded-2xl p-4 flex items-start gap-4 bg-slate-50">
                        <input type="checkbox" id="${inputId}" data-id="${this.escapeHtml(question.id)}" class="mt-1 w-4 h-4 rounded border-slate-300 text-${accentClass}-600 focus:ring-${accentClass}-500" ${isChecked ? 'checked' : ''}>
                        <label for="${inputId}" class="text-sm text-slate-700 leading-relaxed flex-1">
                            <span class="font-semibold text-slate-900 mr-2">${this.escapeHtml(question.id)}</span>
                            ${this.escapeHtml(question.text)}
                        </label>
                    </li>`;
            }).join('');
        };

        const updateProgress = () => {
            const total = questions.length || 1;
            const done = completed.size;
            const percent = Math.round((done / total) * 100);
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressLabel) progressLabel.textContent = `${done}/${total} completate (${percent}%)`;
        };

        listEl.addEventListener('change', event => {
            if (!(event.target instanceof HTMLInputElement)) return;
            const id = event.target.dataset.id;
            if (!id) return;
            if (event.target.checked) {
                completed.add(id);
            } else {
                completed.delete(id);
            }
            persistState(Array.from(completed));
            updateProgress();
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                completed = new Set();
                listEl.querySelectorAll('input[type="checkbox"]').forEach(input => {
                    input.checked = false;
                });
                persistState([]);
                updateProgress();
            });
        }

        renderList();
        updateProgress();
    },

    mountPromptExplorer(containerId) {
        const container = document.getElementById(containerId);
        if (!container || !this.docData.prompts.length) return;
        const select = container.querySelector('[data-role="module-select"]');
        const searchInput = container.querySelector('[data-role="search-input"]');
        const listEl = container.querySelector('[data-role="result-list"]');
        const countEl = container.querySelector('[data-role="result-count"]');
        const detailPanel = container.querySelector('[data-role="detail-panel"]');
        const render = () => {
            const sel = select.value;
            const query = (searchInput.value || '').toLowerCase();
            const modules = sel === 'all' ? this.docData.prompts : [this.docData.prompts[Number(sel)]].filter(Boolean);
            const prompts = [];
            modules.forEach(module => {
                module.prompts.forEach(item => prompts.push({ ...item, module: module.title }));
            });
            const filtered = prompts.filter(item => {
                if (!query) return true;
                return item.text.toLowerCase().includes(query) || (item.id || '').toLowerCase().includes(query);
            });
            countEl.textContent = `${filtered.length} domande`;
            if (!filtered.length) {
                listEl.innerHTML = `<li class="text-sm text-slate-500">Nessun risultato per questa combinazione.</li>`;
                if (detailPanel) detailPanel.hidden = true;
                return;
            }
            listEl.innerHTML = filtered.map(item => {
                const hasAnswer = item.id && this.docData.answerMap[item.id];
                const idChip = item.id ? `<span class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-100">${this.escapeHtml(item.id)}</span>` : '';
                const action = item.id ? (hasAnswer ? `<button type="button" data-role="answer-link" data-id="${this.escapeHtml(item.id)}" class="text-xs font-semibold text-teal-700 hover:text-teal-900">Apri risposta &rarr;</button>` : `<span class="text-xs text-slate-400">Risposta non trovata</span>`) : `<span class="text-xs text-slate-400">ID assente</span>`;
                return `
                    <li class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                        <div class="text-xs uppercase tracking-wide text-slate-400">${this.escapeHtml(item.module)}</div>
                        <p class="text-sm text-slate-700 leading-relaxed">${this.escapeHtml(item.text)}</p>
                        <div class="flex items-center justify-between text-xs">
                            ${idChip}
                            ${action}
                        </div>
                    </li>
                `;
            }).join('');
        };
        const showAnswer = (id) => {
            if (!detailPanel) return;
            const answer = this.docData.answerMap[id];
            const prompt = this.docData.promptMap[id];
            if (!answer) {
                detailPanel.innerHTML = `<p class="text-sm text-slate-500">Nessuna risposta disponibile per l'ID ${this.escapeHtml(id)}.</p>`;
                detailPanel.hidden = false;
                return;
            }
            detailPanel.innerHTML = `
                <div class="text-xs uppercase tracking-wide text-slate-400 mb-1">${this.escapeHtml(answer.module)}</div>
                <h4 class="text-lg font-semibold text-slate-800 mb-2">${this.escapeHtml(answer.title)}</h4>
                ${prompt ? `<p class="text-sm text-slate-600 mb-3">Domanda: ${this.escapeHtml(prompt.text)}</p>` : ''}
                <div class="prose prose-stone max-w-none text-sm">${this.formatAnswerText(answer.body)}</div>
            `;
            detailPanel.hidden = false;
        };
        listEl.addEventListener('click', event => {
            if (!(event.target instanceof Element)) return;
            const btn = event.target.closest('[data-role="answer-link"]');
            if (!btn) return;
            event.preventDefault();
            showAnswer(btn.dataset.id);
        });
        select.addEventListener('change', render);
        searchInput.addEventListener('input', render);
        render();
    },

    renderWikiFooter(viewId, sectionIdx, wikiIds, docWidgets) {
        if (!Array.isArray(wikiIds) || !wikiIds.length) return '';
        const containerId = `${viewId}-wiki-${sectionIdx}`;
        const detailId = `${containerId}-detail`;
        docWidgets.push(() => this.mountWikiLinks(containerId, detailId, wikiIds));
        return `
            <div class="mt-6 pt-4 border-t border-slate-200" data-role="wiki-footer">
                <div class="text-xs uppercase tracking-wide text-slate-400 font-semibold">Domande collegate</div>
                <div id="${containerId}" class="flex flex-wrap gap-2 mt-3"></div>
                <div id="${detailId}" class="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600" hidden></div>
            </div>`;
    },

    mountWikiLinks(containerId, detailId, ids = []) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const detailPanel = document.getElementById(detailId);
        const entries = ids.map(id => ({
            id,
            prompt: this.docData.promptMap[id] || null,
            answer: this.docData.answerMap[id] || null
        }));
        if (!entries.length) {
            container.innerHTML = `<span class="text-xs text-slate-400">Nessuna domanda collegata.</span>`;
            if (detailPanel) detailPanel.hidden = true;
            return;
        }
        container.innerHTML = entries.map(entry => {
            const label = entry.prompt?.text || entry.answer?.title || 'Domanda non trovata';
            return `
                <button type="button" data-role="wiki-link" data-id="${this.escapeHtml(entry.id)}" class="inline-flex items-center px-3 py-1 rounded-full border border-rose-100 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition">
                    ${this.escapeHtml(entry.id)} &middot; ${this.escapeHtml(this.truncateText(label, 60))}
                </button>
            `;
        }).join('');

        const showDetails = (id) => {
            if (!detailPanel) return;
            const prompt = this.docData.promptMap[id];
            const answer = this.docData.answerMap[id];
            if (!prompt && !answer) {
                detailPanel.innerHTML = `<p class="text-sm text-slate-500">Nessun contenuto trovato per l'ID ${this.escapeHtml(id)}.</p>`;
                detailPanel.hidden = false;
                return;
            }
            const moduleLabel = prompt?.module || answer?.module || 'Ripasso';
            detailPanel.innerHTML = `
                <div class="text-xs uppercase tracking-wide text-slate-400 mb-1">${this.escapeHtml(moduleLabel)}</div>
                <h4 class="text-base font-semibold text-slate-800 mb-2">${this.escapeHtml(prompt?.text || answer?.title || `Domanda ${id}`)}</h4>
                ${answer ? `<div class="prose prose-stone max-w-none text-sm">${this.formatAnswerText(answer.body)}</div>` : `<p class="text-sm text-slate-500">Risposta non disponibile.</p>`}
            `;
            detailPanel.hidden = false;
        };

        container.addEventListener('click', event => {
            if (!(event.target instanceof Element)) return;
            const btn = event.target.closest('[data-role="wiki-link"]');
            if (!btn) return;
            event.preventDefault();
            showDetails(btn.dataset.id);
        });
    },

    truncateText(value, maxLength = 60) {
        if (!value) return '';
        const trimmed = value.trim();
        if (trimmed.length <= maxLength) return trimmed;
        return `${trimmed.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
    },

    escapeHtml(value) {
        if (value === undefined || value === null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    initCharts(viewId) {
        if (!HBN_DATA[viewId] || !HBN_DATA[viewId].sections) return;
        
        const sections = HBN_DATA[viewId].sections.filter(s => s.chartId);
        const commonOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

        sections.forEach(section => {
            const ctx = document.getElementById(section.chartId);
            if (!ctx) return;
            
            // --- MODULE 1 (Neuroeconomics) ---
            if (section.chartId === 'chartFraming') {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Guadagno (Gain)', 'Perdita (Loss)'],
                        datasets: [
                            { label: 'Opzione Sicura (A)', data: [72, 22], backgroundColor: '#0d9488' },
                            { label: 'Opzione Rischiosa (B)', data: [28, 78], backgroundColor: '#f43f5e' }
                        ]
                    },
                    options: commonOpts
                });
            }
            if (section.chartId === 'chartDDM') {
                const time = Array.from({length: 30}, (_, i) => i);
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: time,
                        datasets: [
                            { label: 'Accumulo Evidenza', data: time.map(t => t * 0.3 + Math.random() - 0.5), borderColor: '#0d9488', tension: 0.1 },
                            { label: 'Soglia A (Face)', data: Array(30).fill(8), borderColor: 'green', borderDash: [5,5], pointRadius:0 },
                            { label: 'Soglia B (House)', data: Array(30).fill(-5), borderColor: 'red', borderDash: [5,5], pointRadius:0 }
                        ]
                    },
                    options: { ...commonOpts, scales: { x: {display:false}, y: {display:false} } }
                });
            }
            if (section.chartId === 'chartExecFlow') {
                 new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['OFC (Value)', 'DLPFC (Control)', 'ACC (Monitor)', 'NAcc (Reward)', 'Basal Ganglia (Gate)'],
                        datasets: [{
                            label: 'Contributo al Decision Making',
                            data: [90, 85, 80, 75, 70],
                            backgroundColor: 'rgba(20, 184, 166, 0.2)',
                            borderColor: '#14b8a6'
                        }]
                    },
                    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
                });
            }

            // --- MODULE 3 (Environment & Social) ---
            if (section.chartId === 'chartMaguire') {
                new Chart(ctx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            label: 'Vol. Ippocampo Post. vs Anni Guida',
                            data: Array.from({length: 20}, () => ({ x: Math.random()*30, y: 2000 + Math.random()*500 + (Math.random()*30 * 10) })),
                            backgroundColor: '#8b5cf6'
                        }]
                    },
                    options: { ...commonOpts, scales: { x: {title:{display:true, text:'Anni'}}, y: {title:{display:true, text:'Volume mm3'}} } }
                });
            }
            if (section.chartId === 'chartHormones') {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['No Contact', 'IM (Text)', 'Phone', 'In Person'],
                        datasets: [
                            { label: 'Ossitocina (Bonding)', data: [10, 12, 45, 50], backgroundColor: '#8b5cf6' },
                            { label: 'Cortisolo (Stress)', data: [80, 75, 20, 15], backgroundColor: '#f43f5e' }
                        ]
                    },
                    options: commonOpts
                });
            }
            if (section.chartId === 'chartDigitalArousal') {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['FPS (Action)', 'MMORPG (Social)', 'Non-gamer'],
                        datasets: [{
                            label: 'Indice Arousal Autonomico',
                            data: [85, 55, 40],
                            backgroundColor: ['#f97316', '#6366f1', '#94a3b8']
                        }]
                    },
                    options: { ...commonOpts, scales: { y: { suggestedMax: 100 } } }
                });
            }

            // --- MODULE 4 (Placebo) ---
            if (section.chartId === 'chartParkinsonDopamine') {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Striato Dorsale (Motor)', 'Striato Ventrale (Reward)'],
                        datasets: [{
                            label: 'Delta Rilascio Dopamina (%)',
                            data: [65, 40],
                            backgroundColor: ['#22c55e', '#a855f7']
                        }]
                    },
                    options: commonOpts
                });
            }
            if (section.chartId === 'chartConditioningDose') {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['0 sessioni', '1 sessione', '4 sessioni'],
                        datasets: [{
                            label: 'Rigidity Reduction (%)',
                            data: [5, 15, 45],
                            borderColor: '#f59e0b',
                            tension: 0.3,
                            fill: false
                        }]
                    },
                    options: commonOpts
                });
            }
            if (section.chartId === 'chartHormonePlacebo') {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Baseline', 'Aspettativa Verbale', 'Placebo Condizionato'],
                        datasets: [
                            { label: 'GH (ng/mL)', data: [5, 5.2, 9], backgroundColor: '#4ade80' },
                            { label: 'Cortisolo (mcg/dL)', data: [18, 17.5, 11], backgroundColor: '#f87171' }
                        ]
                    },
                    options: { ...commonOpts, scales: { y: { beginAtZero: true } } }
                });
            }
        });
    },

    getAnswerModules(titles = []) {
        if (!Array.isArray(titles) || !titles.length || !Array.isArray(this.docData.answers)) {
            return [];
        }
        const normalized = titles.map(title => (title || '').trim().toLowerCase()).filter(Boolean);
        if (!normalized.length) return [];
        return this.docData.answers.filter(module => normalized.includes(module.title.trim().toLowerCase()));
    },

    formatDocText(text) {
        if (!text || typeof text !== 'string') {
            return '<p class="text-stone-400 italic">Documento non disponibile.</p>';
        }

        const escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return `<pre class="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-6 text-stone-700">${escaped}</pre>`;
    },

    formatAnswerText(text) {
        if (!text) {
            return '<p class="text-sm text-stone-500">Contenuto della risposta non disponibile.</p>';
        }
        const chunks = text.replace(/\r\n/g, '\n').trim().split(/\n{2,}/).map(chunk => chunk.trim()).filter(Boolean);
        if (!chunks.length) {
            return `<p>${this.escapeHtml(text.trim())}</p>`;
        }
        return chunks.map(par => `<p class="mb-3 last:mb-0">${this.escapeHtml(par)}</p>`).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
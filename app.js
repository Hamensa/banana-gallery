// --- SUPABASE CONFIG ---
window.SUPABASE_URL = 'https://vwaidcntrtnixksyfuis.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_Pt1-wpYkluwuXx6vTLp2vg_gpuFlZlw';
window.appSupabase = null;

try {
    if (window.supabase) {
        window.appSupabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        console.log("✅ Supabase initialized successfully in app.js");
    } else {
        console.warn("⚠️ Supabase script not found in window");
    }
} catch (e) {
    console.error("❌ Supabase could not be initialized:", e);
}


// --- PREMIUM MASSIVE SEED DATA (NANOBANANA EDITION) ---
const SEED_DATA = [
    {
        title: "NANOBANANA - CYBERPUNK 2077",
        prompt: "A photorealistic yellow banana embedded with glowing cyan and magenta fiber-optic scales, floating in a dark rainy Neo-Tokyo street, cinematic lighting, 8k resolution.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        title: "LIQUID GOLD LUXURY",
        prompt: "Surreal photography of a banana melting into a pool of liquid gold, high speed splash, clean white background, minimalist, product photography style.",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1200&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Design", "Art"]
    },
    {
        title: "ARCHITECTURAL VOID",
        prompt: "A massive banana-shaped pavilion in a white brutalist desert, people walking around, sharp shadows, architectural photography, hyper-minimalism.",
        image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1200&auto=format&fit=crop",
        model: "Flux.1",
        tags: ["3D", "Design"]
    },
    {
        title: "VOGUE EDITORIAL",
        prompt: "High fashion editorial portrait, model's face partially covered by translucent banana-patterned silk, soft studio lighting, pastel yellow tones.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Portrait", "Art"]
    },
    {
        title: "DIGITAL FRAGMENT",
        prompt: "A 3D isometric render of a banana made of transparent ice with frozen electronics inside, pastel purple background, cute aesthetic, Octane render.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        model: "Stable Diffusion XL",
        tags: ["3D", "Design"]
    },
    {
        title: "NEON SYNTHWAVE",
        prompt: "Retro 80s synthwave style, a glowing wireframe banana flying over a neon grid landscape, purple and orange color palette, vhs glitch effect.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        title: "BOTANICAL STUDY",
        prompt: "Vintage botanical illustration of a futuristic mechanical banana plant, detailed blueprints, aged parchment paper background, ink drawing.",
        image: "https://images.unsplash.com/photo-1618331835717-8178cc05d9c2?q=80&w=1200&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Art", "Design"]
    },
    {
        title: "HYPER CAR CONCEPT",
        prompt: "Concept art of a sleek sports car inspired by the shape of a peeled banana, glossy yellow paint, aerodyamic curves, studio lighting.",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["3D", "Design"]
    },
    {
        title: "MINIMALIST POSTER",
        prompt: "Swiss graphic design poster, a perfect yellow circle and a single black line forming an abstract banana shape, typography layout, clean white background.",
        image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1200&auto=format&fit=crop",
        model: "Flux.1",
        tags: ["Design", "Art"]
    },
    {
        title: "SURREALIST SCULPTURE",
        prompt: "A marble statue of a classical Greek figure holding a giant, hyper-realistic glowing banana, museum exhibition setting, dramatic lighting.",
        image: "https://images.unsplash.com/photo-1520607162513-7770f40d6c5d?q=80&w=1200&auto=format&fit=crop",
        model: "Stable Diffusion",
        tags: ["3D", "Art"]
    }
];

let database = [];

async function startup() {
    console.log("🍌 BANANA ENGINE IGNITION...");
    const gallery = document.getElementById('gallery');
    if (gallery) {
        gallery.innerHTML = '<div style="grid-column: 1/-1; padding: 100px; text-align: center; color: #666; font-size: 1.2rem;">데이터베이스를 동기화 중입니다...</div>';
    }

    try {
        if (window.appSupabase) {
            const { data, error } = await window.appSupabase.from('prompts').select('*').order('id', { ascending: false });
            if (!error && data && data.length > 0) {
                console.log(`✅ Loaded ${data.length} prompts from Supabase`);
                // Append seed data for a rich initial experience
                database = [...data, ...SEED_DATA];
            } else {
                if (error) console.error("Supabase Fetch Error:", error);
                database = SEED_DATA;
            }
        } else {
            console.log("⚠️ Supabase client not available, using seed data only");
            database = SEED_DATA;
        }
    } catch (e) {
        console.error("💥 Unexpected startup error:", e);
        database = SEED_DATA;
    }


    if (gallery) {
        render(database);
        initUI();
    }
}

function render(data) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    if (!data || data.length === 0) {
        gallery.innerHTML = `
            <div id="no-results">
                <h3>검색 결과가 없습니다</h3>
                <p>다른 키워드나 태그로 검색해 보세요.</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = data.map(p => {
        // Safe encoding for onclick handler
        const pString = JSON.stringify(p);
        const encoded = btoa(unescape(encodeURIComponent(pString)));
        return `
        <div class="card" onclick="showDetail('${encoded}')">
            <div class="card-img-wrapper">
                <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800&auto=format&fit=crop'">
            </div>
            <div class="card-info">
                <h3>${p.title}</h3>
            </div>
        </div>`;
    }).join('');
}

function initUI() {
    // Search Functionality
    const search = document.getElementById('search-input');
    if (search) {
        search.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                // Apply current active filter if search is cleared
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) applyFilter(activeBtn.dataset.tag);
                else render(database);
                return;
            }

            const filtered = database.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.prompt.toLowerCase().includes(query)
            );
            render(filtered);
        });
    }

    // Tag Filtering Functionality
    const btns = document.querySelectorAll('.filter-btn');
    if (btns) {
        btns.forEach(btn => {
            btn.onclick = () => {
                const tag = btn.dataset.tag;

                // Visual Update
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Logic Update
                applyFilter(tag);

                // Clear search when clicking a filter
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';
            };
        });
    }

    // Mobile Search Toggle removed - search is always visible

    // Close modal when clicking X
    const modalCloseBtn = document.getElementById('modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.onclick = closeModal;
    }

    // Close modal when clicking outside content
    window.onclick = (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    };
}

function applyFilter(tag) {
    console.log("Filtering by tag:", tag);
    if (!tag || tag === 'all') {
        render(database);
        return;
    }

    const filtered = database.filter(p => {
        // Tag array check (for newer items with precise db schema)
        if (Array.isArray(p.tags)) {
            return p.tags.some(t => t.toLowerCase() === tag.toLowerCase());
        }
        // String check (for older items or seed data)
        return p.tags && p.tags.includes(tag);
    });

    console.log("Filtered count:", filtered.length);
    render(filtered);
}

function showDetail(encoded) {
    let p;
    try {
        p = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
        console.error("Decoding error for modal:", e);
        return;
    }

    const modal = document.getElementById('modal');
    if (!modal) return;

    document.getElementById('modal-image').src = p.image;
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.innerText = p.title;
    const promptEl = document.getElementById('modal-prompt');
    const tagsWrapper = document.getElementById('modal-tags-wrapper');
    if (promptEl) promptEl.innerText = p.prompt;

    const tagsContainer = document.getElementById('modal-tags');
    if (tagsContainer) {
        // Clear existing tags
        while (tagsContainer.firstChild) {
            tagsContainer.removeChild(tagsContainer.firstChild);
        }
        // Add new tags using DOM manipulation
        if (p.tags && Array.isArray(p.tags) && p.tags.length > 0) {
            p.tags.forEach(tagText => {
                const span = document.createElement('span');
                span.className = 'modal-tag';
                span.innerText = tagText;
                tagsContainer.appendChild(span);
            });
        }
    }

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(p.prompt).then(() => {
                showToast("프롬프트가 복사되었습니다!");
                closeModal();
            }).catch(err => {
                console.error("Failed to copy!", err);
            });
        };
    }

    modal.style.display = "flex";
    // Trigger reflow for animation
    void modal.offsetWidth;
    modal.classList.add('show');
    document.body.style.overflow = "hidden";
}

// --- Toast Notification ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = "block";

    // Animate in
    requestAnimationFrame(() => {
        toast.style.bottom = "40px";
        toast.style.opacity = "1";
    });

    // Animate out
    setTimeout(() => {
        toast.style.bottom = "-50px";
        toast.style.opacity = "0";
        setTimeout(() => { toast.style.display = "none"; }, 400); // Wait for transition
    }, 2500);
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }, 400); // Wait for transition
    }
}

// Start application
startup();

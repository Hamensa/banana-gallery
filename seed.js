const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vwaidcntrtnixksyfuis.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Pt1-wpYkluwuXx6vTLp2vg_gpuFlZlw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const initialPrompts = [
    {
        title: "Cyberpunk Banana Street",
        prompt: "A neon-lit cyberpunk city street with a giant hollowed-out banana floating as a futuristic train station, rainy night, cinematic lighting, 8k resolution, highly detailed.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
        model: "Midjourney v6",
        tags: ["Design", "3D"]
    },
    {
        title: "Minimalist Portrait: The Banana Queen",
        prompt: "Minimalist high-fashion portrait of a woman wearing a dress made of banana leaves, golden background, high contrast, elegant, Vogue style.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
        model: "DALL-E 3",
        tags: ["Portrait", "Design"]
    },
    {
        title: "3D Isometric Crypto Banana",
        prompt: "3D isometric rendering of a gold-plated banana floating over a digital circuit board, soft shadows, pastel colors, Octane render.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
        model: "Stable Diffusion XL",
        tags: ["3D"]
    }
];

async function seed() {
    console.log("Seeding database...");
    const { data, error } = await supabase
        .from('prompts')
        .insert(initialPrompts);

    if (error) {
        console.error("Error seeding data:", error);
    } else {
        console.log("Successfully seeded 3 premium prompts!");
    }
}

seed();

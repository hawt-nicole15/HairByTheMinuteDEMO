// Ported from knowledge/hairKnowledge.ts for the Deno edge runtime.
// Keep in sync with the app copy if the knowledge base changes.
export interface HairProfileData {
  questionnaireAnswers: Record<string, string>;
  hairGoals: string[];
  isOnboarded?: boolean;
  accountInfo?: { firstName?: string; lastName?: string; email?: string };
}

// Foundational method knowledge injected for every user
const LOC_LCO_KNOWLEDGE = `LOC/LCO METHOD:
The LOC/LCO method purpose: [L=leave-in/liquid, O=oil, C=cream]
Key tips: for the LOC method use a moisturizing oil / for the LCO method use a sealing oil
LOC adds light fluffiness
LCO adds shine and rich moisture
LOC method provides moisture retention, and more often works for looser hair textures
LCO method is more effective with coarser hair or high textured hair such as type 3 and type 4 hair
High porosity hair uses the LOC method which can be for any hair type
Low porosity hair uses the LCO method
If your hair is chemically treated, colored, or heat-damaged, it becomes high porosity regardless of any hair texture. Damage creates holes and gaps in the hair cuticle. Water enters easily but evaporates almost instantly.`;

// Universal do-not-recommend guidance for type 3 and type 4 natural hair.
const PRODUCTS_TO_AVOID = `PRODUCTS & INGREDIENTS TO AVOID (applies to all type 3 and type 4 natural hair):

Brands / product lines to avoid recommending:
- Cantu

Ingredients to avoid when recommending any product (never recommend a product containing these):
- Sulfates (e.g. sodium lauryl sulfate / sodium laureth sulfate): too stripping for natural curly and kinky type 3 and type 4 hair. Only acceptable for a special, occasional need such as clarifying heavy product buildup.
- Parabens
- Formaldehyde and formaldehyde-releasing preservatives: Quaternium-15, DMDM hydantoin, Imidazolidinyl urea, Diazolidinyl urea
- Drying alcohols: Alcohol denat., SD Alcohol 40, Ethanol, Isopropyl alcohol, Propanol, Isopropanol

When recommending products: do NOT recommend the brands listed above, and only recommend products that are free of the ingredients listed above.`;

const POROSITY_KNOWLEDGE: Record<string, string> = {
  high_porosity: `HIGH POROSITY HAIR:
- Lifted cuticles absorb water fast but lose moisture just as fast
- Protein treatments every 4-6 weeks rebuild the hair shaft
- Seal with heavy butters and oils (shea butter, castor oil, avocado oil)
- Cold water rinses temporarily close the cuticle after washing
- The LOC method (Liquid, Oil, Cream) maximizes moisture retention
- Avoid harsh sulfates; use gentle co-washes between shampoos
- Hair is most vulnerable when wet — handle with care
- High porosity has a high absorption rate, but moisture retention is hard

Ingredients to look for in high porosity hair:
- Hydrating oils such as jojoba oil, avocado oil, coconut oils are your go-tos; they are extremely nourishing and smooth the hair cuticle from your roots to the tip of your hair.
- Aloe vera: this plant's purpose for high porous hair helps soothe your scalp and hair hydration which is incomparable to any other. When using aloe vera the hair strand flyaways that you experience, you can forget about when using aloe vera because it helps that go away.
- Glycerin: this is the key to hydration, glycerin attracts moisture like a magnet, it also keeps your curls hydrated and defined.
- Shea butter: brings extreme softness to your hair, shea butter seals the moisture within your hair strands adding an extra dose of moisture to your kinky curls.
- Cocoa butter: smooths and locks moisture while creating much shine to bring instant life to your hair.

Positives of high porosity hair:
- Nutrients and moisture gets absorbed EXTREMELY quickly
- High porosity hair naturally is receptive to styling products
- Adaptable to different looks
- Quick drying
- Efficient heat styling

How to moisturize high porosity hair and keep it hydrated:
1st - Using the right products: Change harsh and drying formulas for a hydrating shampoo. The gentle cleanser removes all the product buildup while keeping your hair moisturization maintained.
2nd - Layer it on: Once you wash with your shampoo throughout your coils and curls begin using a leave-in conditioner: this will become the foundation of moisture retention within your hair. (look for conditioners packed with ingredients such as lightweight oils, aloe vera, and honey)
3rd - Seal from root to tip: lock in the moisture from your leave-in with a nourishing hair butter or oil. Shea butter oils such as Jojoba oil, Olive oil, Argan Oil, and almond oil.
4th - Deep treatments weekly: To keep your hair healthy and lively, deep conditioning masks are important to maintain once every week. The mask should contain protein & hydrating ingredients such as honey, glycerin, and coconut oil. This will support moisture and repair the high porous hair from root to tip.
5th - Protect throughout the night: ALWAYS keep satin in your bedtime routine whether that's a satin pillowcase, a satin bonnet, or a satin scarf. This allows moisture to retain within your hair throughout the night.

How to avoid over moisturizing on high porosity hair:
While high porosity hair always needs moisture, it's possible to overdo it. To avoid over-moisturizing, listen to your hair. When your coils or curls begin to feel heavy or lose their shape, it may be time to pull back from that product or possibly even the routine. Alternate between moisturizing & strengthening treatments. If the coils or curls are over moisturized, they may even look limp, which will make them feel less bouncy. Balance is the key for healthy & vibrant strands.

Maintaining long-term health for high porosity hair of all hair textures:
Consistency is very important to maintain your high porous hair's long term health.
- Focus on moisture retention: use a hydrating shampoo & leave-in conditioner that hydrates to cleanse and replenish moisture. Incorporate weekly treatments with deep conditioning masks to help repair & nourish your strands.
- Be mindful of your nutrition: Drink plenty of water, consume a balanced diet with plenty of vitamins, such as biotin and omega-3 fatty acids.
- Become comfortable with protective styles: Use styles such as braids or twists that will decrease manipulation & provide hair with a break.
- Prioritize hair trims: Make sure to get trims regularly to keep your coils' split ends at bay & maintain healthy hair growth.

What is high porosity hair?:
High porosity hair is always ready to absorb water which makes the hair quick to hydrate easily but it also lets go of the moisture just as quickly. This is because of the state of your cuticles — the purpose of your cuticles is to provide a protective layer, but when you have high porosity the pores of your hair cuticles are opened a lot more, meaning that your moisture swims freely within your cuticles and out of your cuticles. This means because your hair has a hard time retaining moisture your hair is more prone to dryness and frizz.

How can you tell if you have high porosity hair?
- Your hair drinks moisture quickly: Your hair gets instantly wet as soon as water touches it. This indicates very open cuticles within your tresses.
- Hair is easy to dry: Just as quickly as your hair gets wet is as quickly as it dries. That's due to the fact that moisture escapes the hair follicles easily.
- How your hair absorbs products: With products such as conditioners, creams and oils your hair will soak it up very quickly and it still may feel like your hair needs more to be able to be hydrated.
- Results from deep conditioning: Your hair responds well to deep conditioning treatments, showing results such as softness after at least one treatment or even a few.`,

  medium_porosity: `MEDIUM POROSITY HAIR:
- The most balanced type — cuticles open and close easily
- Responds well to most products and techniques
- Balance protein and moisture: protein treatment monthly
- LCO method (Liquid, Cream, Oil) works well
- Can tolerate occasional heat styling with proper protection
- Clarify monthly to prevent product buildup

Ingredients to look for in medium porosity hair:
For medium porosity it is important to use products that are gentle on the hair that will not cause damage. Clarifying products assist with that so a clarifying shampoo is recommended. Medium porosity is compatible with a wide range of products.
Some key ingredients to look for are products mixed with water-based humectants such as shea butter, honey, oils: coconut oil, sweet almond oil, argan oil, jojoba oil, and/or avocado oil. Some other ingredients to target are aloe vera and glycerin; they bring in moisture.

Positives of medium porosity hair:
- Medium porosity hair requires very low maintenance which can be considered one of the "easier" types compared to low and high porosity
- Medium porosity typically looks healthy and glossy while being manageable
- Styles usually hold well: Curls clump together beautifully, and styles like blowouts or twists stay intact for a long time.
- Drying time is reasonable: It doesn't take a long time to air dry nor blow dry.
- Very malleable with taking color: It absorbs and retains hair dye very predictably without harshly staining

How to moisturize medium porosity hair and keep it hydrated:
To maintain balance with protein moisture you must alternate between 2 different types of hair treatments: moisturising and strengthening treatments. The strengthening treatment is needed every 3-4 wash days, this will reduce breakage and protect hair from any further damage. With your moisture treatment you would need to use it weekly to maintain good moisture levels with your hair. Find out your perfect protein moisture balance by looking specifically at protein rich products.

How to avoid over moisturizing on medium porosity hair:
- Deep conditioning is like a dessert — great in moderation. Bi-weekly deep conditioning is the best way to retain healthy hydrated curls for medium porosity hair.
- If hair is over moisturized then it becomes limp and lifeless
- If the hair is not moisturized enough then it becomes brittle and needs to be hydrated.
- Avoid using heavy butters: heavy, thick creams can cause product buildup very quickly and suffocate your hair.
- Rinse with cold water: When washing your hair, specifically during conditioning and moisturizing treatments, rinse with cold or cooler water. This will force the cuticles to close, locking in an ideal amount of hydration without absorbing moisture excessively.
- Style with damp hair rather than soaking wet hair: Applying products to soaked hair dilutes the styling products completely, causing your curls to weigh down and a drive of moisture overload.

Maintaining long-term health for medium porosity hair of all hair textures:
- Regular deep conditioning: deep condition your hair at least once a week with a moisturizing conditioner or hair mask (ingredients such as aloe vera, glycerin and shea butter help with amazing hydration)
- Leave-in conditioners: Applying leave-in conditioner immediately after washing your hair helps lock in that moisture — be mindful to use lightweight formulas that don't weigh down your hair
- Protective styling: Mainly look for low manipulation styles that protect your hair from humidity, sun, and heat. Hairstyles like: two-strand & mini twists, high or low buns (preferably loose)
- Heat protection: If you decide to use a heating tool, you must ALWAYS apply heat protectant spray or serum before using them. This helps minimize damage and loss of moisture.
- Regular trims: Regular trims help remove the split ends and maintain your hair's overall health, this also allows moisture to be retained.
- Be mindful of your nutrition: Drink plenty of water, consume a balanced diet with plenty of vitamins, such as biotin and omega-3 fatty acids.

What is medium porosity hair?:
Medium porosity is typically identified as a slightly looser cuticle structure. The hair cuticles are the scales that are all over the surface of the hair follicle. This determines how much moisture the hair shaft can receive. With medium porosity, the hair cuticles are half-way open along the hair shaft, meaning the hair shaft can receive moisture pretty easily, but on the other side moisture isn't lost quickly — meaning the cuticles are open enough to receive moisture but closed enough to retain moisture. This type of porosity is the simplest to manage, but heat, bleaching, or any form of coloring can damage the hair and change the porosity over time.

How can you tell if you have medium porosity hair?
- If you spray water on product-free clean hair, the water will begin to form minor water beads on your hair then easily penetrate into the hair shaft.
- Managing and styling is pretty simple
- Hair is easy to get wet
- Hair doesn't take a while to dry
- Having repeated chemical treatments can increase the porosity (causing them to open up more)
- Can hold color well when dyeing hair, but has a harder time staining with semi-permanent dyes`,

  low_porosity: `LOW POROSITY HAIR:
- Tightly closed cuticles resist moisture absorption
- Always use heat during deep conditioning (heat cap or warm towel)
- Lightweight, water-based products penetrate better than heavy butters
- Avoid protein overload — use protein every 6-8 weeks only
- Humectants (aloe vera, glycerin) help moisture enter the shaft
- Clarify every 2 weeks to clear buildup from the cuticle
- Pre-poo with gentle heat to open the cuticle before washing

Ingredients to look for in low porosity hair:
More products will not help, because low porosity has tight cuticles which limits absorption regardless of the amount of products you pile on. The correct routine of products is what makes a difference versus piling products on your hair.
- Hyaluronic acid
- Honey
- Glycerin
- Aloe vera
- Panthenol (Pro-Vitamin B5)
- Lightweight oils (for shine, not sealing)

Positives of low porosity hair:
- Strong, intact cuticle — often a sign of healthy structure
- Grows at the same rate as other porosities (porosity doesn't slow growth)

How to moisturize low porosity hair and keep it hydrated:
- Use lukewarm-to-warm water (not hot) when washing to lift the cuticle
- Sit under a hooded dryer or use a hair steamer after applying conditioner
- Use bathroom steam from a hot shower if no steamer is available
- Wrap a warm towel around treated hair for 10-15 minutes
- Section hair into 4-6 parts and apply products section by section to wet hair
- Do 15-30 minute steam treatments with a moisturizing conditioner
- Use humectants (hyaluronic acid, honey, glycerin, aloe vera, panthenol) to pull moisture in
- Use express moisture treatments (e.g., 60-second masks) designed for hair that resists absorption
- Refresh between washes with water-based sprays

How to avoid over moisturizing on low porosity hair:
- Don't slather product on dry, sectionless hair — more product doesn't mean more absorption
- Avoid heavy butters and sealing oils (coconut oil, castor oil, heavy shea as a final seal)
- Avoid thick creams that sit on top and weigh hair down
- Skip dimethicone (a heavy silicone)
- Skip highly acidic products like apple cider vinegar rinses (they close the cuticle)
- Cleanse regularly since buildup accumulates faster on hair that doesn't absorb well
- Generally avoid protein treatments — they create stiffness without strengthening

Maintaining long-term health for low porosity hair of all hair textures:
With low porosity hair, low tension protective styles is the solution to long term growth.
- Look for shampoos with honey or glycerin (they penetrate more easily than oils), and use a clarifying shampoo weekly to remove buildup
- Dilute conditioner with a little water so it absorbs instead of sitting on the strand; thinner milk-type conditioners work well
- Deep condition weekly with heat — a steamer, heat cap, hooded dryer, or shower cap + blow dryer on warm
- Avoid protein treatments — they pull moisture out and raise breakage risk for low porosity hair
- Don't skip cleansing — buildup accumulates faster on low porosity hair
- Trim every 6-8 weeks to prevent split ends from traveling up the shaft
- Avoid damage that artificially opens the cuticle (chemical processing, heat damage)
- Work with low porosity rather than trying to "fix" it

What is low porosity hair?:
Low porosity is when the hair cuticles are extremely tight because they are densely packed together. This means that it is difficult for water and products to penetrate the hair shaft. This doesn't mean it's bad — it means the hair just needs a little more of a push to encounter moisture.
- Low porosity is genetic; if heat or chemical change is put on the hair it changes it to high porosity because it raises the cuticles.
- Hair with a cuticle layer that is tightly closed and tightly overlapped (like shingles on a roof)
- The sealed cuticle makes it hard for water, conditioners, and oils to penetrate the shaft
- Moisture tends to bead up on the surface and roll off instead of soaking in
- Usually genetic, not something you caused or can fundamentally change

How can you tell if you have low porosity hair?
- Product sits on your hair: When having low porosity, you may notice that hair products tend to sit on top of your hair instead of being absorbed (hair feels coated, not nourished). An example is when you apply an oil or a moisturizer to the ends of your hair, a half an hour later you'll see that the product that you applied is still on top of your hair.
- Washing and drying takes much longer: Because low porosity hair takes much longer to absorb water, wetting your hair is extremely hard. Once the water finally penetrates your hair, the air-drying time takes a while. Even when blow drying your hair it takes longer than others even if they have the same length and/or thickness.
- Float test: Wash your hair (make sure it's clean from all buildup), make sure that it is dry, take a strand and put it in a glass of water — low porosity hair will float on top of the water, medium porosity hair stays in the middle of the glass, high porosity quickly sinks to the lower half.
- Protein treatments leave hair stiff, straw-like, or worse — not stronger`,
};

const CURL_PATTERN_KNOWLEDGE: Record<string, string> = {
  type_3: `TYPE 3 HAIR (includes 3A, 3B, 3C):
- Ranges from loose spirals to tight corkscrews with a visible S-pattern
- Shrinkage is typically 30-50%
- Can lose definition with too much or too little product
- Lightweight gels and creams give the best definition
- Diffusing enhances curl pattern without disturbing it
- Finger coiling individual sections boosts definition

TYPE 3A HAIR:
Ingredients to look for in 3A hair:
- Hyaluronic acid (hydrates and adds shine)
- Jojoba oil (locks in moisture)
- Natural oils generally
- Keratin amino acids (strengthen and nourish)
- Hemisqualane, squalane, and avocado oil (reduce frizz, strengthen, add shine)
- Lightweight formulas overall — so hair stays bouncy, not weighed down

Positives of 3A hair:
- Curls spring back when pulled out of their original shape
- Forms a clearly defined S-shape / corkscrew curl
- Versatile: can hold all braid styles (knotless braids, single plaits, straight-back cornrows)

How to moisturize 3A hair and keep it hydrated:
- Use a hydrating shampoo followed by a light conditioner to detangle in the shower
- Deep condition once a week for extra nourishment
- Apply a light leave-in conditioner after towel drying
- Use natural oils like jojoba to lock in moisture
- Spritz hair with water between washes to refresh curls, then add additional products
- Focus on hydration overall: it curbs frizz, keeps hair soft, and boosts definition and shine

How to avoid over-moisturizing on 3A hair:
- Choose lightweight products so hair stays bouncy and doesn't get weighed down
- Don't over-wash — it strips natural oils
- Washing once a week is sufficient
- Use dry shampoo between washes if the scalp gets greasy
- If you use heavy styling products, rinse without shampoo between washes to prevent buildup that clogs the scalp

Maintaining long-term health for 3A hair:
- Don't wash more than once a week to preserve natural oils
- Avoid braid styles that are too tight or cause tension (can cause hair/scalp damage or hair loss)
- Don't leave braided styles in longer than 8 weeks
- Air dry or use low-to-medium heat when drying
- Be aware that chemical treatments and heat damage from hot tools can alter porosity over time

What is 3A hair?
- A loose curl pattern that sits between wavy and curly on the spectrum
- A round, loose S-shape curl with fine-to-medium texture and minimum volume
- Corkscrew-shaped: wider curl diameter, but still springs back when pulled
- Reads curly, not wavy

How can you tell if you have 3A hair?
- Curls form a clear, round S-shape (vs. 2C, which is a defined wave, not a curl)
- Spiral, corkscrew-shaped curls with a wider diameter
- Texture can appear more coarse than type 2 wavy hair
- 3A is NOT inherently any specific porosity. Curl shape and porosity are independent — you can have 3A hair that's low, medium, or high porosity.
- 2C vs. 3A confusion is common: the distinguishing factor is shape — 2C bends in a wave, 3A forms a round curl.

TYPE 3B HAIR:
Ingredients to look for in 3B hair:
- Hyaluronic acid
- Fatty acids
- Oils
- Lightweight oils (to seal in hydration)

Positives of 3B hair:
- Significant volume
- Defined curl patterns
- Curls stay coiled no matter the tool or product used on them (unlike 3A, which can lose definition)
- Versatile — can be worn long or short
- Looks amazing simply air-dried when properly hydrated

How to moisturize 3B hair and keep it hydrated:
- Layer products to build and retain moisture (layering is the key word)
- Do a pre-shampoo oil treatment before every shampoo
- Use deep masks on dry, dirty hair prior to cleansing
- Layer a rich shampoo and conditioner
- Apply a lightweight leave-in conditioner, then follow with a curl-specific product (cream, milk, etc.)
- Add a layer of lightweight oil to seal in hydration
- Lightly moisturize hair between washes
- Saturate wet, clean hair with curl cream from root to ends, then gently scrunch

How to avoid over-moisturizing on 3B hair:
- Opt for lightweight leave-in products to avoid weighing hair down
- Choose products with lightweight textures to avoid weighing down curls and losing definition
- Finer textures should swap curl cream for a less dense option like a mousse or lotion (coarser textures can use curl cream)

Maintaining long-term health for 3B hair:
- Avoid heat as much as possible
- Avoid sulfates
- Avoid color and chemical treatments as much as possible to minimize damage and dryness
- Create and follow a comprehensive plan for daily care and protection
- Create a sleep hair routine — protect hair in loose buns or braids, or use satin/silk pillowcases
- Use the plopping method to style post-shower
- Cut hair dry (not wet) for clearer curl patterns and proportions

What is 3B hair?
- A curl pattern characterized as tight and springy — curls that wrap around your finger
- Circumference similar to that of a Sharpie
- Ringlet-shaped, voluminous, springy curls
- Loose to loosely corkscrewed curl patterns with medium frizz and texture
- Defining characteristics tend to be dehydration and frizz

How can you tell if you have 3B hair?
- Curls fall under the springy ringlet category
- Voluminous, loose corkscrew curl pattern (vs. 3C's tighter corkscrew and stiffer texture)
- Experiences shrinkage from wet to dry
- Becomes puffy and frizzy when brushed
- Likely to have a mix of looser spirals and springy corkscrews throughout
- Hair typing isn't perfect — trichologist Bridgette Hill explicitly warns that the system has a long and complicated history, and naturally curly hair often has more than one pattern. Someone with "3B hair" could realistically have a mix of 2C, 3A, 3B, and 3C patterns on the same head.
- Texture-based product choice: coarser 3B textures use curl cream; finer 3B textures use mousse or lotion.

TYPE 3C HAIR:
Ingredients to look for in 3C hair:
- Shea butter
- Coconut oil
- Argan oil
- Natural moisturizing ingredients generally
- Formulas that promote moisture retention
- Formulas with strengthening properties
- For sealing oils (LOC method): jojoba oil or avocado oil
- Ingredients to avoid: sulfates (harsh, strip natural oils), silicones (can weigh down curls or cause buildup)

Positives of 3C hair:
- The curliest curls in the type 3 category
- Densely packed corkscrew ringlets, full of volume and bounce
- One of the most photographic hair types
- The most volume of any type 3 pattern
- One of the most defined curl shapes of any natural hair type
- Defined curl pattern visible without product
- One of the most versatile textures to style
- Less shrinkage than type 4 hair

How to moisturize 3C hair and keep it hydrated:
- Make moisturizing your focus — all curly hair needs it, 3C is no exception
- Do weekly deep conditioning treatments with a hair mask
- Use the LOC method daily
- Layer a few drops of oil for shine and a jelly/gel for definition and hold
- Spritz leave-in conditioner before tying hair up at night
- For high-porosity 3C: use heavier sealing products, proteins, and the LOC method
- For low-porosity 3C: use lighter, water-based products and heat during deep conditioning

How to avoid over-moisturizing on 3C hair:
- Signs you're using too much product: curls feel stiff, look weighed down, lose volume, or feel greasy
- Start with less product and add more only if needed
- Too much product can clump curls into thin, stringy sections — try less per application or switch to lighter formulas
- For low-porosity 3C specifically: use lighter products since heavy ones sit on top

Maintaining long-term health for 3C hair:
- Use sulfate-free shampoos that don't strip natural oils
- Deep condition weekly
- Pineapple hair at night with a satin scrunchie
- Sleep on a satin or silk pillowcase
- Detangle every wash day in sections with conditioner
- Use finger-detangling first instead of aggressive combing
- Snip out fairy knots with small scissors — never pull or pick at them (causes irreversible breakage)
- Use protective styles (twist-outs, Dutch braids, Bantu knots, box braids, updos) to give hair breaks
- Limit heat to once a month maximum, with heat protection
- Figure out your porosity so you can choose the right products

What is 3C hair?
- The tightest curl pattern in the type 3 category
- Sits between 3B (looser ringlets) and 4A (the first type 4 pattern)
- Tight corkscrew ringlets about the width of a pencil
- Dense and full of volume
- Naturally dry (less than type 4 but still moisture-demanding)
- Fine to medium texture
- Prone to single-strand knots and tangling

How can you tell if you have 3C hair?
- Tight corkscrew ringlets roughly the width of a pencil
- Smaller than 3B (marker width) but larger than 4A (drinking straw width or smaller)
- Curls cluster close together
- Unmistakably curly — pattern is visible even on freshly washed hair
- Defined, springy corkscrews
- Vs. 4A: 3C corkscrews are looser and clump into defined ringlets; 4A coils are tighter with more of an S-pattern
- Wash frequency: every 7-10 days — notably less frequent as curl tightness increases
- Heat use: once a month maximum — much stricter than 3A or 3B guidelines`,

  type_4ab: `TYPE 4A/4B HAIR:
- 4A has tight coils (pen-sized); 4B has a Z-pattern with sharp angles
- Shrinkage is typically 50-70%
- Needs consistent moisture — tight coils make it hard for scalp oils to travel down
- Protective styling is key for length retention
- Twist-outs and braid-outs are effective for definition
- Low manipulation reduces breakage significantly

TYPE 4A HAIR:
Ingredients to look for in 4A hair:
- Jojoba oil
- Olive oil
- Coconut oil
- Shea butter
- Aloe vera
- Honey
- Macadamia oil
- Primrose oil
- Irish moss
- Biotin
- Oils and butters generally
- Organic ingredients, free from harmful chemicals

Positives of 4A hair:
- Iconically voluminous
- Springy and one-of-a-kind
- Gravity-defying curls and coils
- Lots of root lift / volume from the root
- Ability to stretch
- Out and up growth
- Versatile — countless styling options
- Less likely to become oily
- Retains moisture better than 4B and 4C
- Naturally defined curl pattern makes wash-and-go easy

How to moisturize 4A hair:
- Infuse routine with plenty of moisture
- Section and twist detangled hair after applying conditioner
- Let conditioner sit at least 5-10 minutes (or longer)
- Leave a little conditioner in the ends to help with styling
- Layer post-shower from lightest to heaviest: leave-in → mousse → curl cream/gel → sealing oil
- For low porosity: use a shower cap with intensive conditioner
- For high porosity: avoid hot water, end with cold water, regularly moisturize
- Deep condition weekly to every 1-2 weeks
- Use the "plop" method: wrap wet hair in a cotton t-shirt or microfiber towel
- Use hydrating masks (can leave on as long as desired)
- Seal with oils after moisturizing

How to avoid over-moisturizing on 4A hair:
- Fine 4A texture: use lighter products — heavy products weigh hair down
- Coarse 4A texture: use richer products with more moisture

Maintaining long-term health for 4A hair:
- Protect hair while sleeping with a high bun or satin cap
- Use a silk/satin pillowcase to reduce frizz and friction
- Detangle with care using detangling products while coated in conditioner in the shower
- Use wide-tooth combs or finger detangling to prevent breakage
- Brush leave-in through to create curl clumps post-shower
- Wash frequency based on texture: fine every 2-4 days, medium every 4-5 days, thick once a week max
- Air dry when possible; if heat needed, use diffuser/hooded dryer with heat protectant
- For high porosity: occasional protein treatments to strengthen cuticles
- For low porosity: avoid protein treatments
- Use protective styles (braids, twists, updos) to reduce environmental exposure

What is 4A hair?
- The freshman / loosest of Type 4 patterns
- Hair that grows up and out, with coils that absorb light
- S or O-shaped coils with lots of volume at the roots
- Iconically voluminous, springy, one-of-a-kind
- A dense and vibrant blend of coily and voluminous texture
- Often mirrors 3C characteristics due to expanding curl clusters
- Coarse, dense texture (coarseness intensifies along the Type 4 spectrum)
- Demonstrates pronounced shrinkage — stretched strands much longer than apparent length
- "Afro" vs. 4A clarification: "afro" is an abbreviation for afro-textured hair (basically synonymous with 4A), while "fro" is a hairstyle (rounded shape around the head), not a hair type. Any type 4 hair can be styled into a fro.
- Multiple curl patterns on one head is normal
- Deep conditioning frequency: 1-2 weeks for 4A

How can you tell if you have 4A hair?
- S or O-shaped coil pattern (or mixed)
- Lots of root lift / volume from the root
- Gravity-defying volume
- Ability to stretch
- Out and up growth
- More coils than curls (key 3C difference)
- S-shape most visible when stretched/pulled
- Tightly packed coils with pronounced shrinkage
- Normal to have multiple curl patterns — identify what you "mostly" have

TYPE 4B HAIR:
Ingredients to look for in 4B hair:
- Castor oil
- Black cumin seed oil
- Ginger
- Coconut oil
- Olive oil
- Jojoba oil
- Rosehip oil
- Almond oil / sweet almond oil
- Shea butter
- Cacay oil
- Sea moss
- Aloe vera
- Grapeseed oil
- Avocado oil
- Safflower oil
- Matcha green tea
- Panthenol
- Ingredients to avoid: sulfates, parabens, phthalates, alcohols, waxes, formaldehyde, relaxers, texturizers, harsh hair dyes (especially cheap box dyes)

Positives of 4B hair:
- Bouncy, springy, showstopping, juicy coils
- A fluffy, voluminous "cloud-like" appearance
- Incredibly versatile — wide range of styling options
- Can be sleek/glossy or styled with colorful headwraps
- Identifiable curl pattern (visible zig-zag, unlike 4C)
- Naturally beautiful — invites attention

How to moisturize 4B hair and keep it hydrated:
- Maintain high moisture levels at every step
- Deep condition weekly or bi-weekly
- Apply leave-in conditioner to damp hair, then seal with oil
- Use the LOC method — Leave-in → Oil → Cream
- Pre-poo before shampooing — apply oil or deep conditioner before washing to prevent moisture stripping
- Let pre-poo sit at least 30 minutes (or hours/overnight)
- Cover hair with a plastic cap or microfibre towel during deep conditioning for maximum penetration
- Rinse conditioner with cool water to seal cuticles and lock in moisture
- Warm oil treatments once a month to improve circulation and deep moisture
- Use lighter daily refreshes between washes
- Use sulfate-free shampoo

How to avoid over-moisturizing on 4B hair:
- Fine 4B texture: avoid heavy gels and creams that weigh hair down
- Use lightweight oils (jojoba, rosehip, coconut, almond) rather than heavy sealants if 4B handles lighter formulas

Maintaining long-term health for 4B hair:
- Limit heat usage — once a month maximum with heat protection
- Use protective styles regularly to reduce manipulation (flat twists, twist-outs, Bantu knots, cornrows, box braids, updos)
- Continue moisturizing scalp and hair while in protective styles with light oils, creams, or hydrating sprays
- Don't leave protective styles in too long — tension and lack of washing causes damage and product buildup
- Trim every 3-4 months or when you notice split ends
- Avoid chemicals (relaxers, texturizers, harsh box dyes)
- Sleep with a satin bonnet, cozy, or on a silk/satin pillowcase
- Detangle with fingers first, or a wide-tooth comb / detangling brush on conditioner-saturated hair
- Never detangle dry 4B hair
- Wash in sections (4-8 sections) to prevent tangling and ensure thorough cleaning
- Use soft hair ties and clips that won't snag or break hair
- Apply shampoo primarily to scalp, not full length of hair
- Air dry when possible; if using heat, use a diffuser on lowest setting with heat protectant
- Blot wet hair with a microfiber towel or old t-shirt — never rub with a regular towel
- Stretch curls (twist-outs, braid-outs, flexi rods, Bantu knots) to reduce shrinkage and prevent fuzziness
- Most 4B routines show improvement within 4-6 weeks; bigger changes (definition, length, density) take 3-6 months

What is 4B hair?
- The middle of the three type 4 patterns (between 4A and 4C)
- Densely packed coils with a Z-shape / zig-zag pattern (not the S-curve of looser types)
- Sharp angular bends and kinks
- Naturally porous and dry, prone to breakage
- Significant shrinkage — 50-75% (hair appears that much shorter than actual length)
- A diverse texture spectrum (often a mix of 4A and 4C patches)
- Fluffy, voluminous, cloud-like appearance

How can you tell if you have 4B hair?
- Very curly with a zig-zag formation and sharp bends rather than consistent curls/coils
- Lacks definition with varied texture
- Hair feels relatively dry to the touch
- Hair shrinks dramatically — 50-75% shrinkage
- Cloud-like / cotton-like fluffy appearance
- Pattern visible but not springy (vs. 4A's defined ringlets)
- Pattern visible (vs. 4C, where pattern is often hidden without product)
- May have patches of 4A and 4C textures on the same head — normal
- When wet, hair looks longer than expected; when dry, shrinks dramatically
- The average wash day is roughly weekly to bi-weekly
- Specific definition technique: apply products to soaking-wet hair, let dry completely without disturbing — for getting wash-and-gos to work on 4B`,

  type_4c: `TYPE 4C HAIR:
- Tightest coil pattern with minimal visible definition without product
- Shrinkage can reach 70-90% — length retention is the main challenge
- Extremely prone to dryness and breakage; requires maximum moisture
- Protective styles (braids, twists, updos) are essential for growth
- Greenhouse method (overnight with dampened hair under a plastic cap) works extremely well
- Never manipulate when dry — always detangle when wet with product

Ingredients to look for in 4C hair:
- Jamaican black castor oil
- Coconut
- Rosemary
- Biotin
- Mint
- Almond oil
- Pomegranate
- Honey
- Ginger
- 100% natural / organic ingredients
- Nourishing oils and nutrients
- Ingredients to avoid: silicones (cause buildup, weigh curls down, smother the scalp), sulfates (strip natural oils, lead to brittle hair, breakage, and shrinkage struggles), damaging chemicals generally

Positives of 4C hair:
- Beautiful and versatile — one of the most beautiful and versatile hair types
- Known for tight coils and incredible volume
- High amount of body compared to Types 1, 2, and 3 hair
- Strong/resilient — caring for it means embracing its strength

How to moisturize 4C hair and keep it hydrated:
- Wash and deep condition weekly
- Use a sulfate-free, moisturizing shampoo
- Alternate shampoo with a gentle co-wash
- Apply a leave-in conditioner after detangling to lock in moisture
- Moisturize and seal often: wet hair → water-based moisturizer → seal with oil
- Use a lightweight scalp and hair mist (rosemary water style) to refresh between wash days
- Use a rich, hydrating curling cream that defines and seals in moisture (good for high-porosity 4C)
- Use deep conditioning products consistently
- Use leave-in conditioners, co-washes, hair oils, creams, and gels on wash day and every day

Maintaining long-term health for 4C hair:
- Detangle gently with a wide-tooth comb or fingers while hair is wet and conditioned
- Detangle starting from ends and work up to roots
- Limit heat damage — use heat tools on low settings, apply heat protectants, space out styling sessions
- Trim every 8-12 weeks to prevent split ends from traveling up
- Get regular trims every 6 weeks or so initially, then stretch to every 3-4 months as hair gets healthier
- Eat hair-promoting foods: fatty fish (salmon, mackerel), spinach, berries, avocado, eggs, almonds
- Use protective styles (twists, braids, wigs) — start prep with deep conditioning
- Use moisturizing heat protectants and protective styling products
- Massage scalp to release natural oils and clear dead skin cells, residue, sweat
- Use scalp-specific treatments — rosemary mint oil to detoxify and increase blood circulation
- Embrace your natural curls rather than fighting them

What is 4C hair?
- The tightest curl pattern in the Andre Walker hair typing system
- Densely packed, tight coils or zigzag strands with minimal natural definition without manipulation
- Extreme shrinkage (often 70%+)
- Tight coil or zigzag pattern, usually without a defined curl unless styled
- Prone to dryness because natural oils struggle to travel down the coils
- Highly elliptical hair shape with a high degree of porosity
- Made up of more orthocortical cells in a whorl-like pattern, which creates the tight springy coils (the biological reason curls form: paracortical cells sit on the inside of each curve and orthocortical cells on the outside)
- Coily/kinky in texture
- Dense — falls in a unique Z curl pattern
- Most fragile and least defined curls of the natural hair types

How can you tell if you have 4C hair?
- Densely packed, tight coils or zigzag strands
- Minimal natural definition without manipulation
- Curl tightness and shrinkage are defining features
- Extreme shrinkage (often 70%+)
- Texture can range from soft and delicate to coarse and wiry
- Strand thickness, density, and porosity can vary widely among people with 4C hair
- Cultural framing: having natural 4C hair can carry emotional weight — the curl type has historically been pathologized in mainstream media; embracing it is part of the journey.
- Protein vs moisture rotation: protein treatments (Bond Mask) alongside moisture-focused care
- Trim frequency consensus: 8-12 weeks`,
};

const SCALP_KNOWLEDGE: Record<string, string> = {
  dry_scalp: `DRY SCALP CARE:
- Oil the scalp regularly with lightweight blends (jojoba, tea tree, peppermint)
- Avoid sulfate shampoos that strip natural oils
- Shampoo every 7-10 days to preserve scalp oils
- Hot oil treatments before washing soothe and replenish

Ingredients to look for in dry scalp care:
- Propanediol caprylate (gets to root cause of dandruff, reduces redness and irritation)
- Argan oil (keeps scalp moisturized)
- Jojoba oil (mimics natural sebum, helps skin repair)
- Vitamin E (soothes and strengthens skin barrier)
- Peppermint essential oil (soothes and balances scalp)
- Tea tree essential oil (soothes and balances scalp)
- Sea salt (boosts volume, aids blood circulation to follicles)
- Hydrogenated castor oil beads (gently exfoliate and stimulate)
- Plant extracts / plant-powered ingredients
- Amino acids, fatty acids, panthenol (vitamin B5)
- Ingredients to avoid: sulfates (strip natural oils, dry out scalp), parabens (artificial preservatives), heavy silicones (cause buildup), fragrances (if prone to irritation), harsh detergents

Distinguishing dry scalp:
- It's a common condition that's treatable with the right routine
- Distinguishable from dandruff (smaller dry white flakes vs. larger oily yellow flakes), which makes diagnosis easier
- Often resolves once the root cause is identified (product buildup, hard water, nutrient deficiency, porosity mismatch, etc.)

How to moisturize dry scalp and keep it hydrated:
- Use a gentle sulfate-free cleanser to wash without stripping natural oils
- Apply a hydrating deep conditioning treatment between washes to replenish moisture
- Use a rich leave-in conditioner that melts into strands
- Apply a soothing scalp serum (with argan/jojoba/vitamin E) directly to the scalp
- Refresh with a root refresher mist between washes instead of rewashing
- For low porosity hair specifically: use heat (steamer, or hair dryer over a shower cap) during moisturization so products actually absorb
- Drink enough water to support scalp hydration from inside out

How to avoid over-moisturizing on dry scalp:
- Moisture overload is real — can leave hair feeling soft and struggling to hold shape
- Don't overwash — wash 1-3 times a week max (overwashing strips natural oils and dries scalp out further)
- Use clarifying shampoo every 4-5 washes (or every 2-4 weeks for low porosity hair using heavy butters) to remove product buildup
- Pay attention to how your hair reacts when introducing new products
- Avoid heavy butters and oils (shea butter, coconut oil) if they sit on top and build up — especially with low porosity hair

Maintaining long-term scalp health for dry scalp:
- Be consistent with your wash day routine
- Use a cleansing shampoo regularly to prevent buildup that blocks follicles
- Clarify every 4-5 washes
- Use a scalp massager to boost circulation and remove stubborn dirt
- Eat a balanced diet with biotin (B7), fruit daily, oily fish, fruits, veggies — biotin deficiency is linked to dry scalp
- Get iron and vitamin D levels checked — severe deficiencies can cause extreme dryness and breakage
- Stay hydrated by drinking enough water (supports skin barrier and oil regulation)
- Install a shower filter and hard water treatment if you have hard water
- Use fragrance-free formulas if prone to irritation
- Sleep on a satin or silk pillowcase to protect from friction
- Consult a dermatologist if issues persist after using the right products — rules out serious conditions

What is dry scalp?
- When the skin on your head and hairline doesn't retain enough moisture, resulting in flaking and itchiness
- Caused by loss of moisture (different from dandruff, which is caused by oil buildup and Malassezia yeast)
- Often triggered by: wrong hair products, climate (extreme heat, cold weather, central heating, hot showers), stress, hormone fluctuations, poor diet, dehydration, smoking, excessive alcohol, product buildup, overwashing, sensitive skin, or skin conditions (contact dermatitis, psoriasis, seborrheic dermatitis)
- For people with curly hair specifically: the unique shape means natural oils stay at the top of the hair, so combined with less frequent washes and protective styles, the scalp can suffer from buildup and flakes
- Can also stem from nutritional deficiencies (iron, vitamin D, biotin) or hard water exposure

How can you tell if you have dry scalp?
- Flakes are smaller, dry, and white in color (vs. dandruff's larger, oily, yellowish flakes)
- Itchiness and flaking
- Hair looks frizzy and dull
- Scalp feels tight
- Buildup is noticeable on the scalp
- Hair feels like products are just sitting on top instead of absorbing (especially with low porosity hair)
- If your scalp doesn't improve with hydrating products, it may actually be dandruff or something requiring a dermatologist`,

  oily_scalp: `OILY SCALP CARE:
- Shampoo more frequently (every 5-7 days)
- Use a clarifying shampoo once a month
- Avoid applying oils directly to the scalp
- Focus conditioning on lengths and ends only
- Use a scalp scrub monthly to keep follicles clear

Ingredients to look for for an oily scalp:
- Gentle cleansing surfactants: sodium C14-C16 olefin sulfonate, sodium cocoyl methyl taurate (and similar)
- Charcoal (for clarifying)
- Salicylic acid or glycolic acid (chemical exfoliants for the scalp)
- Witch hazel (rose water witch hazel works well — removes oil and sweat while maintaining scalp pH)
- Tea tree oil (natural antiseptic, oil-controlling, antifungal)
- Apple cider vinegar (kills off yeast tied to dandruff, removes deep buildup without compromising scalp barrier)
- Aloe vera juice/gel (anti-inflammatory)
- Green tea, ginger, marshmallow root, peppermint, rosemary (in herbal tea rinses — antioxidants and nutrients)
- Lightweight, non-comedogenic oils only: hemp seed oil (omega-3, strengthens follicles), pumpkin seed oil (natural DHT blocker, zinc strengthens follicles), jojoba oil (matches scalp's natural sebum), argan oil, grapeseed oil
- Sea salt (boosts volume, aids blood circulation to follicles)
- Ingredients/products to avoid: sulfates (strip natural oils, scalp overcompensates with more oil), heavy butters and oils (coconut oil, shea butter — clog and weigh down oily scalps), heavy silicones, excessive styling products that build up

Positives of an oily scalp:
- Sebum is essential and healthy in normal amounts — keeps hair hydrated and protects the scalp
- Indicates active, functioning sebaceous glands
- Often manageable through habit and routine adjustments (washing schedule, diet, hands-off, product choice)
- Easier to balance than scalps with underactive glands once you identify the cause

How to moisturize an oily scalp and keep it hydrated:
- Use lightweight, oil-free conditioners on lengths and ends only — avoid the scalp
- Rinse conditioner thoroughly so it doesn't contribute to buildup
- Apply non-comedogenic oils sparingly to ends only
- Use scalp massages with lightweight nutrient-rich oils (hemp seed, pumpkin seed, jojoba)
- Use an herbal hair tea rinse (green tea, ginger, marshmallow, peppermint, rosemary) for scalp nourishment
- Drink plenty of water to support scalp hydration from inside out
- Focus moisture on hair lengths and ends, not roots

How to avoid over-moisturizing an oily scalp:
- Don't wash too often — washing too frequently strips natural oils and causes the scalp to overproduce sebum
- Don't apply conditioner to the scalp directly
- Don't use heavy butters, creams, or oils (especially coconut oil and shea butter)
- Keep styling products lightweight and use sparingly to prevent buildup
- Avoid touching hair too often (transfers oils from hands)
- Don't apply heavy oils to the scalp on a regular basis

Maintaining long-term oily scalp health:
- Use a hydrating sulfate-free shampoo once a week or every other week as the regular wash
- Clarify once a month with a charcoal-based shampoo, apple cider vinegar rinse, or clarifying treatment
- Wash 1-2 times a week — concentrate shampoo on the scalp, not lengths
- Exfoliate the scalp once a week or every other week using chemical exfoliants (lactic/salicylic acid) or a physical scalp brush
- Use witch hazel on a cotton pad between washes to absorb excess oil and sweat without disrupting the scalp barrier
- Use dry shampoo sparingly between washes (look for one without white residue)
- Eat a balanced diet — fruits, vegetables, healthy fats; limit greasy, processed, sugary, and salty foods
- Stay hydrated by drinking plenty of water
- Keep hands out of hair to avoid transferring oils
- Sleep on a satin or silk pillowcase to reduce oil transfer and friction
- Use protective styles (braids, twists, buns) to reduce manipulation — but not too tight (tightness irritates scalp and increases oil)
- Only brush curly hair when wet with conditioner in the shower (avoids overstimulating sebaceous glands)
- Address dandruff specifically with apple cider vinegar, tea tree oil, and aloe vera (kills Malassezia yeast, reduces inflammation)

What is an oily scalp?
- A condition where the sebaceous glands produce excess sebum (the natural oil that keeps the scalp and hair moisturized)
- Sebum in moderation is healthy — it hydrates hair and protects the scalp from bacteria, pollutants, and dryness
- Excess sebum can lead to greasy roots, dull/lank/lifeless hair, dandruff, clogged follicles, hair thinning, and slowed hair growth
- For curly hair: sebum struggles to travel down the twists and turns of the hair shaft, so it builds up at the roots — meaning oily roots can coexist with dry ends
- Common causes: overactive sebaceous glands (genetic), hormonal changes (puberty, pregnancy, menopause), improper hair care (over-washing or using heavy products), poor diet, sweat from frequent workouts, hot/humid climate, infrequent washing, touching hair too often
- The vicious cycle of overwashing → more oil: many people instinctively wash more when their hair feels oily, which makes it worse.
- Witch hazel as a between-wash spot treatment is a specific, low-cost technique that bridges the gap for people who can't wash as often.
- The dual-condition phenomenon on curly hair: oily roots + dry ends is a critical insight. Most generic oily hair advice doesn't account for this.

How can you tell if you have an oily scalp?
- Visible signs: greasy, lank, and lifeless-looking hair
- The roots look oily even shortly after washing
- Pressing your head against a glass surface leaves an oil mark
- Running fingers through hair leaves them feeling oily
- Pillowcase feels greasy in the morning
- Pressing a tissue to the scalp shows visible grease under light
- Frequent scalp itchiness
- Dandruff or scalp irritation
- Excessive buildup or oiliness on the scalp
- Slower hair growth and thinning (signals clogged follicles)
- Oily roots with dry ends (especially for curly hair)
- Hair feels weighed down faster than expected after washing`,

  balanced_scalp: `BALANCED SCALP CARE:
- Maintain current wash frequency (every 7-10 days)
- Light scalp oils as needed between washes
- Monthly clarifying to remove buildup
- Continue what's currently working

Ingredients to look for for a healthy scalp:
- Antioxidant-rich plant oils and extracts
- Shea butter, coconut oil, rosemary oil (in pH-balanced cleansers)
- Liquid proteins and B5 (for strengthening dry, brittle hair)
- Rosemary (improves circulation)
- Peppermint (cooling, soothing)
- Lavender (combats dandruff and inflammation)
- Lemon (clarifying)
- Lightweight, non-greasy oils that absorb without clogging pores
- Acidity regulators commonly found in conditioners (help maintain balanced pH)
- Ingredients/products to avoid: sulfates (strip natural oils, leave scalp lacking), heavy oils left on the scalp post-wash (feed Malassezia fungus), highly alkaline products (pH 7 or higher — cause irritation and open the cuticle), parabens and artificial fragrance

Positives of a healthy scalp:
- The scalp does a great job at regulating itself when supported
- Rich network of blood vessels supplies nutrients to hair follicles
- Sebaceous glands produce sebum, which conditions hair and scalp and helps retain moisture
- The natural acidic pH (4.5-5) fights off bacteria and fungal growth
- Skin cells constantly shed and renew themselves
- Promotes optimal hair production — strong, hydrated, resilient strands
- Creates the best environment for healthy growth and length retention
- Maintains color longevity for those with color-treated hair
- Keeps the cuticle sealed, which reduces frizz and breakage

How to moisturize and keep a healthy scalp hydrated:
- The scalp needs hydration just like skin — prevents dryness and irritation
- Use a gentle, sulfate-free, pH-balanced shampoo to cleanse without stripping
- Co-wash between shampoo washes — conditioner reseals the cuticle and most have acidity regulators that maintain balanced pH
- Choose products in the acidic pH range (4.5-5.5) to keep the cuticle sealed and retain moisture
- For irritated/itchy scalp specifically: use a shampoo between pH 6-7
- Massage the scalp to distribute natural oils
- Use herbal-infused oils to nourish without clogging
- Drink enough water — hydration starts internally

How to avoid over-moisturizing on a healthy scalp:
- Don't keep hair wet for long periods — creates breeding ground for bacteria and can cause moisture overload
- Avoid sitting with conditioner in hair for hours
- Don't oil the scalp post-wash — Malassezia fungus depends on oil to thrive, causing inflammation, itching, and flaking
- Pre-shampoo oil treatments are fine (they get washed away); leave-on scalp oils are the issue
- Clarify every 4-5 washes to remove excess buildup
- Don't use shampoos that are too alkaline — they strip too much natural oil and trigger the scalp to overproduce, making hair oilier faster

Maintaining long-term scalp health:
- Cleanse at least weekly with a pH-balanced shampoo
- Use sulfate-free shampoo as the regular cleanser
- Clarify every 4-5 washes for deeper buildup removal
- Don't oil the scalp on a regular basis
- Don't keep hair wet for extended periods
- Invest in a water filter/softener for hard water (calcium and magnesium clog follicles, reduce shampoo effectiveness)
- Massage the scalp to boost circulation and encourage growth
- For color-treated hair: use acidic-dominant products to keep the cuticle contracted, prevent fading, and reduce dryness/breakage
- Be consistent — pick easiest habits first and build up rather than overhauling everything at once
- View scalp care as supporting natural function, not overriding it

What is a healthy scalp?
- The foundation of healthy hair — everything starts at the root
- Part of the body's largest organ (the skin)
- Houses hair follicles, the structures responsible for hair growth
- Has a natural pH of 4.5-5 (acidic), which fights bacteria and fungal growth
- Contains a rich blood vessel network delivering nutrients to follicles
- Has sebaceous glands producing sebum to condition and moisturize
- A self-regulating microbiome with constantly shedding/renewing skin cells
- Free from buildup, inflammation, excessive dryness or oiliness, flaking, irritation, or follicle clogging
- Maintained in acidic balance — when pH rises (becomes alkaline), the cuticle opens and dryness, itching, flaking follow
- The pH framework: acidic = closed cuticle = retained moisture, less frizz, less breakage. Alkaline = open cuticle = dryness, irritation, frizz, fading color.
- Curly hair has a higher natural pH than straight hair, meaning curly/coily hair naturally sits closer to the alkaline side, which is part of why it tends to be drier. An acidic-dominant product helps neutralize this.
- Common scalp issues that signal disruption: dryness and flaking, excess oil and buildup, inflammation and sensitivity (eczema, psoriasis)

How can you tell if your scalp is healthy?
- No itching, flaking, or visible irritation
- No excessive shedding or thinning
- Hair growth is steady
- Scalp doesn't feel tight, sensitive, or inflamed
- Not visibly greasy or noticeably dry between washes
- No pimples, infections, or recurring tenderness
- Strands feel strong, hydrated, resilient
- Hair retains moisture and doesn't dry out quickly after washing
- The cuticle is sealed — hair has shine and isn't frizzy`,

  sensitive_scalp: `SENSITIVE SCALP CARE:
- Avoid fragranced products and sulfates
- Look for soothing ingredients: aloe vera, chamomile, green tea, tea tree
- Patch-test new products before full application
- Diluted apple cider vinegar rinse (1:3 with water) balances scalp pH
- Be gentle when detangling near the scalp

Ingredients to look for for a sensitive scalp:
- Aloe vera (anti-inflammatory, soothes and hydrates, calms redness/itchiness/sunburn)
- Colloidal oatmeal
- Chamomile (calming properties, reduces irritation)
- Panthenol (Vitamin B5)
- Tea tree oil (refreshes scalp in balanced amounts, natural antifungal — pair with a carrier oil like coconut for scalp massages)
- Glycerin (supports moisture retention and hydration)
- Lightweight botanical extracts (nourish without buildup)
- Apple cider vinegar rinses (remove buildup and balance pH)
- Natural preservatives like rosemary extract or neem oil (gentler than synthetic preservatives)
- Ingredients/products to avoid: harsh sulfates (strip natural oils, cause irritation and dryness), synthetic/artificial fragrances and dyes (can trigger allergic reactions), drying alcohols (strip scalp's ability to retain moisture), silicones, parabens, formaldehyde-releasing preservatives (cause irritation and itching), aggressive exfoliants, overly heavy oils and waxes (increase buildup), strong essential oils in high concentrations, heavy fragrance blends

Positives of a sensitive scalp:
- Recognizing scalp sensitivity early gives you a clear signal — pain or soreness is your scalp telling you something is wrong
- Awareness allows you to adjust your routine before damage compounds
- Many triggers are external and within your control (products, hairstyles, water temperature)
- Often improves significantly with gentle care, lightweight products, and ingredient awareness
- Forces a more intentional, scalp-first approach that benefits curls long-term too

How to moisturize a sensitive scalp and keep it hydrated:
- Use lightweight conditioners, hydrating leave-ins, and non-greasy curl creams
- Focus moisture on hair lengths and ends — not directly on the scalp
- Use lukewarm water (not hot) when washing to preserve moisture balance
- Choose products with humectants like glycerin that retain moisture
- Use aloe vera for soothing and hydrating the scalp without irritation
- Lightweight hydration works better than heavy product overload
- Hydrated curls reduce friction, which supports scalp comfort

How to avoid over-moisturizing on a sensitive scalp:
- Avoid excessive product layering
- Focus styling products on hair lengths, not the scalp
- Choose lightweight formulas instead of heavy creams, oils, or butters
- Don't apply heavy oils directly to the scalp — increases buildup and irritation
- Use a gentle clarifying shampoo periodically to break down buildup without disturbing scalp pH
- Don't overload hair with styling products (traps sweat and residue near the scalp)
- Co-washing works for some, but occasional deeper cleansing may still be needed to prevent buildup

Maintaining long-term sensitive scalp health:
- Cleanse 2-3 times per week (or weekly if scalp is dirty/has buildup) — both overwashing and under-cleansing disrupt balance
- Use a gentle, sulfate-free cleanser as the regular wash
- Patch test every new product before full use
- Be gentle when styling and detangling
- Build a scalp-friendly routine and stick with it consistently
- Try an apple cider vinegar rinse to remove buildup and balance pH
- Use scalp-friendly oils (tea tree with a carrier oil) for gentle scalp massages with fingertips, not nails
- Give your scalp breaks between protective styles — tight ponytails, buns, weaves, and braids cause sensitivity
- Avoid heat styling, hot water, and wrong styling tools
- Limit heat — air dry when possible; use low heat and avoid the scalp area when blow-drying
- Always use heat protectant when heat styling
- In humid climates: use lightweight products, avoid heavy layering, cleanse gently but consistently
- CCCA flag (important): Persistent scalp soreness or tenderness could signal Central Centrifugal Cicatricial Alopecia (CCCA), a type of scarring alopecia that disproportionately affects Black women. CCCA causes permanent follicle damage if untreated. See a dermatologist or trichologist if pain, stinging, burning, itching, tenderness, or soreness continues despite gentle care.

What is a sensitive scalp?
- A scalp that contains many nerve endings, making it more reactive than other skin areas
- Reacts easily to products, environmental conditions, or irritation
- Feels uncomfortable, itchy, dry, tight, or inflamed after washing, styling, or exposure to certain ingredients
- A sore scalp is the scalp's way of saying something is wrong
- Common causes: harsh chemicals, product buildup, fragrance overload, environmental exposure (pollution, sun, wind, cold, humidity), hormonal changes (puberty, pregnancy, menopause), stress, certain medical conditions (psoriasis, folliculitis, autoimmune disorders, hormonal imbalances), hard water, tight hairstyles, heat styling, scalp conditions like dandruff or bacterial/fungal infections
- People with curly hair may experience scalp sensitivity more often because curl routines require multiple products and moisture-rich layering — increasing chances of buildup and irritation
- Sensitive scalp is often misdiagnosed as dry scalp or dandruff. Key differentiator: dry scalp = flakes; dandruff = oily yellow flakes + yeast; sensitive scalp = pain, burning, tightness, redness without necessarily having flakes.

How can you tell if you have a sensitive scalp?
- Itching after washing
- Tightness or dryness
- Redness or visible irritation
- Burning sensation from products
- Flaking or discomfort
- Sensitivity to fragrances
- Scalp soreness or tenderness
- Persistent or ongoing discomfort
- Scalp pain (signals inflammation, stress, or poor hygiene)
- Stinging sensation that continues despite gentle care (this signals it's time to see a professional)`,
};

const GOAL_KNOWLEDGE: Record<string, string> = {
  moisture: `MOISTURE & HYDRATION:
- Hydration comes from water-based products; oils and butters seal it in
- Deep condition every wash day for at least 30 minutes
- LOC or LCO method prevents moisture loss between washes
- Baggy method (overnight on dampened hair) dramatically boosts moisture
- Humectants (glycerin, aloe vera) draw moisture from the air

Ingredients to look for to moisturize dry natural hair:
- Water as the first ingredient on any leave-in product label
- Distilled water (preferred over tap for spritzing/refreshing)
- Lightweight oils: avocado, olive, castor, almond, jojoba, argan
- Heavier oils for hot oil treatments: olive, castor, coconut, avocado
- Honey (natural humectant — pairs well with conditioner as a mask)
- Aloe vera (soothes and hydrates, applied directly to damp hair for softness)
- Hair milks (lightweight, water-based — work especially well for low porosity hair)
- Cream-based leave-ins
- Pomades for sealing (the "oil" step in LCO method)
- Shea butter (in moisture butters — though may weigh down low-density or fine hair)
- Ingredients/products to avoid: harsh shampoos with strong sulfates (strip natural oils), heavy butters and creams if you have low-density or fine hair (weigh hair down), anything that doesn't list water as the first ingredient (likely sitting on top of hair instead of penetrating)

How to moisturize dry natural hair and keep it hydrated:
- Water first — it's the best moisturizer. Mist with distilled water (preferred) or tap water before applying any product
- Section hair into smaller sections so every strand gets coated — don't apply product to a full head at once
- Apply a water-based leave-in conditioner (water should be the first ingredient on the label)
- Apply oil after leave-in to seal in moisture
- Apply a styler (cream or gel) last to lock everything in
- Methods to layer products:
  LOC method: Liquid (water) → Oil → Cream
  LCO method: Liquid (water) → Cream → Oil
  Test both methods to see which works for your hair
- Deep condition weekly with heat (steamer, hooded dryer, hot head, or plastic cap using body heat)
- Hot oil treatments at home — warm an oil, apply, cover with shower cap, rinse after 30 minutes
- Honey and conditioner mask for extra moisture
- Aloe vera gel directly on damp hair
- Greenhouse effect — sleep with a plastic bag over damp/conditioned hair to seal in moisture
- Drink plenty of water — hydration starts internally

How to avoid over-moisturizing dry natural hair:
- Don't slather product on dry, unsectioned hair (it just sits on top)
- For low-density or fine hair, avoid extremely thick butters that weigh hair down
- For low-porosity hair, use lightweight, water-based products — heavy products sit on top and never absorb
- Use the right amount of product — start small and add as needed
- Don't apply product without first sectioning and prepping with water

Maintaining long-term moisture for dry natural hair:
- Cleanse gently with a sulfate-free shampoo or moisturizing cleanser
- Co-wash between wash days if hair feels especially dry (conditioner-only wash to revive without stripping)
- Deep condition after every wash, focusing on mid-lengths and ends, with gentle heat for penetration
- Never detangle with just water — always pair water with conditioner (dry hair is in a vulnerable, breakage-prone state)
- Finger-detangle when possible; otherwise use a wide-tooth comb or tangle teaser, never a fine-tooth comb
- Trim every 3-4 months — split ends travel up the shaft and cause more dryness
- Use a satin or silk bonnet, scarf, or pillowcase at night (cotton absorbs moisture)
- Use protective styles (braids, twists, buns) — but don't leave them in longer than 6-8 weeks
- Maintain a nutrient-rich diet
- Drink plenty of water consistently — internal hydration shows in hair appearance
- Be consistent — moisturizing isn't a one-off task; it's a routine
- Give your hair the same attention you give your skin — it needs time, effort, and patience

What is dry natural hair?
- Natural hair is naturally dry — it's the baseline state, not a flaw
- The unique curl pattern of textured hair makes it harder for the scalp's natural oils (sebum) to travel down the hair shaft to the ends
- Curls/coils have more twists and turns, so oils stay near the scalp instead of distributing along the strand
- Without external moisture, dryness leads to tangling, breakage, lack of definition, and loss of length
- Properly moisturized natural hair feels soft, has sheen, and is more elastic and less breakage-prone
- Dryness is often worsened by winter months, harsh products, hard water, or improper care routines
- LOC vs LCO: the order matters based on porosity — low porosity hair often does better with LCO (cream first, then oil) because heavier products can sit on top if applied last; high porosity hair often does better with LOC.
- Distilled water vs tap water: distilled water is the preferred refresh spray because tap water minerals build up over time.
- The "never detangle with just water" rule is critical — detangling without slip (conditioner) causes major breakage.
- Greenhouse effect (plastic bag over damp conditioned hair overnight) is a low-cost technique specific to natural hair communities — worth trying for users on a budget.
- Deep conditioning weekly with heat is the single most reinforced practice across all natural hair sources.

How can you tell if you have dry natural hair?
- Hair feels rough, brittle, or straw-like to the touch
- No visible sheen or shine — hair looks dull
- Hair has no definition, even after styling
- Products sit on top of strands instead of absorbing (signals low porosity dryness specifically)
- Hair breaks easily when handled or detangled
- Constant tangling and knotting
- Curls/coils don't hold their shape
- Hair feels dry shortly after applying products — moisture isn't being retained
- No elasticity — strands don't stretch and bounce back`,

  growth: `HEALTHY GROWTH:
- Length retention is the real goal — most hair grows at similar rates
- Protective styles keep ends tucked away from friction
- Scalp massages with carrier oil boost blood circulation to follicles
- Trim split ends every 3-4 months to stop breakage from traveling up
- Nutrition supports growth: protein, biotin, iron, omega-3s

Ingredients to look for to grow natural hair:
- Water (must be the first ingredient on leave-in product labels)
- Humectants: honey, glycerin, aloe vera
- Castor oil (especially Jamaican black castor oil for scalp stimulation)
- Black cumin seed oil
- Jojoba oil
- Lightweight oils: avocado, olive, almond, argan
- Natural, water-based formulas
- Sulfate-free cleansers
- Foods/internal ingredients that support hair growth:
  Vitamins A, C, D, E, K, biotin (B7), iron, zinc
  Leafy greens (spinach, kale, collards)
  Eggs and lean proteins
  Fatty fish (salmon)
  Sweet potatoes, carrots, squash
  Nuts and seeds (walnuts, pumpkin seeds)
  Berries, kiwi, citrus
  Omega-3s and fatty acids
  Avocados
- Ingredients/things to avoid: harsh sulfates, hair products that suffocate hair or block moisture absorption, tight pulling styles and rough handling, excessive heat, excessive sugar (spikes insulin → spikes DHT → contributes to hair loss), excessive caffeine, excessive alcohol (dehydrates, causes inflammation)

Positives of growing natural hair:
- Healthy natural hair has visible sheen, softness, elasticity, and definition
- Length retention shows that your routine is working
- Once you understand your hair, it becomes much easier to maintain
- Achievable for everyone with patience — hair grows about half an inch per month (roughly 6 inches per year) for most people
- Builds confidence as you see progress over time
- Natural hair is versatile — wash-and-gos, protective styles, twist-outs, braid-outs, buns, etc.

How to moisturize hair to support growth:
- Water first — wet hair before applying any product
- Use water-based leave-in conditioners (water as the first ingredient)
- LOC method: Liquid (water) → Oil → Cream
- LCO method: Liquid (water) → Cream → Oil — try both and see what works
- Apply aloe vera juice or water-based hydration first, then seal with oil or butter cream
- Deep condition weekly with heat (steamer, hooded dryer, hot head, or plastic cap using body heat)
- Steam hair to open cuticles and let moisture penetrate (especially for low porosity hair)
- Moisturize before hair becomes dry — don't wait until it's parched and weakened
- Drink plenty of water (hydration starts internally)

Maintaining long-term hair growth for all hair textures:
- Wash regularly — don't go longer than 2-3 weeks without washing (a clean scalp grows healthier hair); irritated, clogged follicles can lead to alopecia, dandruff, and slowed growth
- Cleanse with a gentle, moisturizing sulfate-free shampoo
- Trim regularly — every 8-12 weeks, or pay attention to when your ends feel rough, look thin, or have split ends/knots
- Trim every 12-16 weeks if consistently protective styling
- Gentle styling — avoid tight buns, tight ponytails, tight braids, small tight sections (causes traction alopecia)
- No strands left behind — careful with metal accessories, careful when taking down styles
- Detangle gently — finger detangle when possible; use wide-tooth combs or detangling brushes only with conditioner and water (never on dry hair)
- Detangle from ends to roots in small/medium sections
- Don't do your hair when frustrated, rushed, or angry — you'll be more aggressive than you realize
- Protective styling — give hair a break from manipulation, but make sure styles are installed gently, not too tight, and not left in longer than 6-8 weeks; care for the hair underneath (wash, moisturize)
- Low manipulation — minimize how often you have your hands in your hair
- Low tension — if a style hurts, it's not protective; use medium-to-large sections to distribute tension
- Low heat — limit heat styling drastically; if blow drying, do small sections
- Stretch hair instead of using heat (twist-outs, braid-outs, banding, threading)
- Nighttime protection — satin or silk bonnet, scarf, or pillowcase (cotton absorbs moisture)
- Pineapple long hair at night to keep ends off rough surfaces
- Scalp massages — fingertips (not nails) for 3-5 minutes, slow circles; pair with oiling scalp every 2-3 days
- Drink water consistently and reduce sugary drinks (sugar spikes insulin → DHT → hair loss)
- Limit alcohol (dehydrates, causes inflammation)
- Exercise regularly — increases blood flow to the scalp, just like scalp massages
- Manage stress — chronic stress disrupts hair growth cycles and can cause telogen effluvium (excessive shedding)
- Sleep, hydrate, eat well — basic foundations
- Build a routine and stick to it — consistency over experimentation
- Stop switching products — give one product time to actually work before deciding
- Take pictures of your progress — growth happens slowly and is hard to notice without before/after comparison
- Speak life into your hair — believe it's growing, stop comparing to others
- Take vitamins to fill gaps — broader hair/skin/nails vitamins with vitamins A, C, D, E, biotin, zinc, iron tend to be better than biotin alone
- Get bloodwork done if you suspect deficiencies — especially iron and vitamin D, which directly affect hair health
- Listen to your scalp — if a product makes your scalp itch, burn, or feel tight or painful, stop using it

What is natural hair growth?
- Hair grows about half an inch per month on average, or roughly 6 inches per year for healthy hair
- Growing natural hair is really about length retention more than growth speed — most people's hair is growing fine; they're just losing length to breakage at the same rate
- Hair grows from the root, not the ends (trimming doesn't speed up growth, but it prevents losing length)
- Because natural hair shrinks, visible length changes more slowly than actual growth
- Hair is the least important protein in your body — your body will deprioritize hair if other systems aren't supported, so internal health (food, water, sleep, stress, hormones) directly affects what shows up at the scalp
- Hair follicles are fed by blood vessels at the root — so blood flow, nutrients, and circulation all contribute to growth
- Hair growth cycles can be disrupted by stress, hormonal changes, illness, deficiency, and damage

How can you tell if your hair is growing?
- Take pictures regularly (weekly or monthly) — growth is hard to see without comparison
- Length checks while hair is stretched (curly/coily hair has dramatic shrinkage that hides growth)
- New growth at the roots becoming more visible
- Hair feels denser at the scalp
- Ends look fuller, not thin or wispy
- Strands feel strong and elastic, not breaking off easily
- Less hair on the floor, in your brush, and on your towel between washes
- Hairline and edges are filling in (no thinning)
- Hair holds styles longer because it has more density
- If your hair seems "stuck at the same length," growth is usually still happening — you're just losing length to breakage at the same rate`,

  curl_definition: `CURL DEFINITION:
- Apply all products to soaking wet hair for best definition
- Shingling (applying curl by curl) gives maximum definition
- Avoid touching hair while drying — hands cause frizz
- Diffuse on low heat to set the curl without disturbing it
- Refresh day-old curls with a water-glycerin spray

Ingredients to look for in curl-defining products:
- Flaxseed (elongating, prevents shrinkage, prevents dryness and flaking)
- Hydrolyzed rice protein (adds bounce and elasticity)
- Castor oil (smooths, conditions)
- Irish moss (retains moisture, boosts elasticity and shine)
- Lightweight oils for finishing: olive oil, rice bran oil (smooth out the crunch after gel cast)
- Alcohol-free formulas
- Water-based formulas
- Ingredients/products to avoid: heavy oils and butters (cause buildup and weigh curls down), too many layered products (block curl clumping), harsh chemicals — relaxers, perms, excessive bleach (permanently alter curl structure), drying alcohols, for 4C hair specifically: hot air from dryers (leaves strands stiff and resistant)

Positives of having defined curls:
- Smooth, shiny clumps that show off the natural curl pattern at its best
- Polished and uniform in shape
- Last longer than undefined curls
- Resist frizz better
- Give style bounce and shape
- Can last up to 5-7 days between washes
- Achievable on ALL curl types — including 4C, regardless of pattern (Z-shapes, pen spring coils, mixed zig-zag waves, S-shapes, spirals)
- Lightweight definition doesn't weigh hair down
- Easy to refresh between washes without re-doing the whole routine

How to moisturize hair to support curl definition:
- Hair must be deeply moisturized BEFORE applying any curl-defining product (dry strands won't clump)
- Deep condition before defining — moisture is the magic ingredient that urges strands to clump together
- For low porosity 4C hair specifically: use a super conditioner that infuses moisture deep without clogging the surface; apply in sections, finger-comb in, cover with cling film for 15 minutes
- Use water as a base — apply styling products to wet hair so curls stay smooth and frizz-free
- Keep a spray bottle handy to re-wet sections as you style
- More water = more clumping (less volume); less water = less clumping (more volume)
- Strands should feel slippery and look serenely wavy when properly moisturized
- LOC or LCO method to lock in moisture
- For Type 3 and looser curls: apply products on soaking-wet hair
- For Type 4 / low porosity: deep condition first, then air-dry hair to 80%+ before applying stylers

How to avoid over-moisturizing while defining curls:
- A little goes a long way — start with a pea-sized amount and add more as needed
- Apply product in sections to avoid layering too much in one spot
- Don't apply cream or leave-ins directly to the roots (kills volume, makes hair lay flat)
- Stop adding gel when hair starts to feel smooth and wet with a few waves down the length — too much loses volume
- Don't pile butters, creams, and gels all at once — moisture overload + product buildup blocks clumping
- For low porosity hair: apply stylers when hair is at least 80% dry, not soaking wet (low porosity has no room for products when strands are full of water)
- Avoid heavy oils and butters that cause buildup over time
- Watch for stiffness, weighed-down curls, loss of volume, or greasy feel — signs of too much product

Maintaining long-term curl definition:
- Wash before styling — start with a clean slate so products can work, no residue from previous styles
- Cleanse without over-washing — balance is key (clean scalp, hydrated strands)
- Clarify regularly with a detox shampoo to remove buildup and hard water minerals that block definition
- Apply products in small sections (1-2 inches wide, no more than half-inch deep for 4C; small to medium for Type 3)
- Use styling techniques that encourage clumping: raking, praying hands, scrunching, finger coiling, twisting around finger
- Brush curls UP and AWAY from scalp to give them lift and prevent flat sticking
- Hold hair flat against the brush with your finger for maximum definition (like curling ribbon with scissors)
- Don't touch curls while drying — disturbs the pattern and causes frizz
- Wait until hair is 100% dry before scrunching out the gel cast and fluffing
- Smooth out the crunch after drying with a small amount of olive or rice bran oil — gently run fingers down the length
- Diffuse on low heat / low speed, or air dry; hover diffuse for elongation, scrunch diffuse for bounce
- Microfiber towel or cotton t-shirt only — never rough fabric
- Sleep with hair in a pineapple on top of the head (use a satin scrunchie or invisibobble-style band to avoid creasing)
- Wear a satin bonnet at night
- Refresh in the morning by misting frizzy sections, redoing curls around the face and crown, and scrunching
- For 4C specifically: define on DRY hair, not wet (this is opposite to looser curl types)
- For 4C specifically: gels outperform butters and mousses
- Repair damage — bond repair treatments restore strength so curls can hold clumps
- Get protein/moisture balance right — too little moisture or too much protein = frizzy/brittle; too much moisture or too little protein = limp/shapeless
- Avoid heat tools (flat irons, blow dryers without diffusers) — break down curl pattern
- Use heat protectant any time heat is applied
- Eat well, hydrate, get enough sleep — nutritional deficiencies and stress show up as poor curl definition

What is curl definition?
- Curl definition is how clearly and distinctly curls form into groups, or "clumps," of strands that follow the same shape or pattern
- When neighboring hairs align and coil together, they create visible, cohesive curl groups instead of appearing frizzy, separated, or undefined
- Defined curls look smooth, springy, and uniform in shape — whether loose waves or tight coils
- All curl patterns can achieve definition — but how it shows up varies by texture and density
- For 4C hair specifically: definition is possible regardless of pattern; well-defined 4C curls look like soft, uniform clumps with visible curl paths rather than fluffy/undefined shape
- Most curl-defining products are designed for looser, higher-porosity curls — which is why generic products often fail on 4C low porosity hair (it requires a different method)

How can you tell if your curls are undefined?
- Lack of curl clumps — individual strands sit on their own instead of grouping into uniform curls
- Frizz and flyaways — hair looks fuzzy or puffy because strands aren't aligning smoothly
- Dull appearance — without definition, curls can look dry and lack shine
- Excess bulk or uneven volume — hair looks bigger and rounder without clear curl separation
- Hair looks puffy instead of having distinct curls/coils
- Hair doesn't hold its shape from wash day to wash day
- Curl pattern is hard to see, even when freshly styled
- Curls fall apart quickly after styling`,

  protective_maintenance: `PROTECTIVE STYLE CARE:
- Keep hair moisturized under styles with a light leave-in spray
- Never leave protective styles in longer than 6-8 weeks
- Protect hair nightly with a satin scarf or bonnet
- Deep condition before and after any protective style
- Avoid styles that pull tightly — this causes traction alopecia

Ingredients to look for in products used during protective styling:
- Castor oil (strengthens, supports scalp)
- Ginger
- Black cumin seed
- Rosemary
- Mint / peppermint
- Honey
- Coconut oil
- Biotin
- Organic seed oils
- Soy protein and vitamin B5 (in leave-in conditioners)
- Sulfate-free, gentle cleansers
- Lightweight oils that won't cause buildup
- Non-flaky pomades for edges
- Ingredients/products to avoid: synthetic hair (in styles using it) — synthetic hair competes with your natural hair for moisture and dries it out; heavy oils that cause buildup; tight-grip products that cause flaking; anything causing scalp pain, white bumps, or thinning at edges

Positives of protective styling:
- Protects natural hair from tugging, pulling, and breakage from daily manipulation
- Shields hair from environmental damage (heat, cold, wind, sun)
- Maintains moisture and helps hair retain hydration longer
- Promotes length retention — more growth stays on your head instead of breaking off
- Protects edges from thinning when installed correctly
- Saves time on your daily hair routine
- Allows hair to rest while still looking polished
- Versatile across all hair types, lengths, and textures
- Lightweight options exist (mini twists, two braids) for those with finer hair
- Some styles can last 4-8 weeks with proper care
- Lets you try different looks (length, color, texture) without committing to chemical changes

How to moisturize hair while in a protective style:
- A protective style is only as protective as you make it — moisture is the foundation
- Don't wait until your hair feels dry before moisturizing — moisturize regularly between wash days
- Spray-in moisture treatments and lightweight leave-ins are essential
- Use a lightweight oil on the scalp once a week if scalp is exposed (any visible parting)
- Use a dropper-style oil to target your scalp directly without disturbing the style
- Apply a light moisturizing mist to braids/twists between washes
- Quick deep conditioning sessions every few weeks help keep hair healthy
- Wash hair while in the style — dilute sulfate-free shampoo with water, apply directly to scalp using a pointed-tip applicator, massage gently, rinse from scalp outward
- Dry hair completely after washing to prevent mildew
- Seal moisture in with a light oil after deep conditioning or washing
- The more your hair stays moisturized, the longer the style lasts looking fresh
- For best results: choose styles that still let you access your scalp easily

How to avoid over-moisturizing while in a protective style:
- Don't over-apply oil to your strands — a little goes a long way
- Too-slippery hair can sabotage protective styles (especially crochet braids — they can slip out if hair is too slick)
- Apply just enough product to feel moisturized, not greasy
- Avoid heavy butters and oils that cause buildup
- Don't apply heavy braiding gels for tight slicking — these dry hair out under the style
- Don't oil the scalp excessively — once a week is enough in most cases

Maintaining long-term hair health with protective styling:
- Prep is everything — install on clean, deep-conditioned, moisturized, detangled hair
- Trim ends before installing — don't try to "save" damaged ends under braids; they'll be there when you take it down, just worse
- Make sure the style is lightweight, low tension, allows scalp access, and allows moisture
- If a style hurts, white bumps appear at the hairline, or there's visible thinning — it's too tight; take action immediately
- Persistent scalp pain beyond 24 hours after install = the style is too tight
- Don't leave styles in longer than 6-8 weeks (most styles); some say 8 weeks maximum
- Take a 1-2 week break between protective styles — let your hair and scalp cleanse, treat, and rest
- Wear a satin or silk bonnet or scarf to sleep every single night — not optional
- Wrap braids/twists with a satin scarf before bonneting for extra protection
- Tie a satin or moisture-wicking scarf around your hairline during workouts to absorb sweat and protect edges
- Apply a lightweight, non-flaky pomade along your edges before tying down at night
- Use a soft toothbrush to lay edges — never a hard bristle brush, never with strong tension
- Don't reinstall protective styles back-to-back without breaks — continuous styles cause scalp issues and edge stress
- Listen to your hair — different textures handle styles differently; finer hair may not tolerate the same styles as thicker hair
- Take down styles gently from ends to roots — never roots-down
- Add moisture during takedown for braided styles (light mist of water or leave-in spray)
- Use a wide-tooth comb or rat-tail comb for takedown — never fine-tooth
- Pre-detangle while taking down before getting hair wet
- After takedown: detangle in sections with conditioner before washing
- Cleanse thoroughly post-takedown to remove all product residue from the wear period
- Deep condition immediately after takedown to restore moisture and strength
- Choose styles based on your hair goals — type 4 hair tends to hold twists, braids, and locs well; type 2 and 3 may need more hold product and may not last as long

What is a protective hairstyle?
- Any hairstyle that tucks your ends away to protect hair and minimize damage
- Protects natural hair from tugging, pulling, breakage, manipulation, heat, and environmental factors
- The principles: hide your ends, minimize friction, reduce exposure, support length retention
- Includes braids, twists, locs, faux locs, wigs, weaves, buns, updos, and various tucked styles
- Lasts anywhere from a few days (twist out) to several weeks (box braids, sew-in weaves)
- A protective style is only protective if installed correctly AND maintained correctly — too tight, worn too long, or installed on poorly-prepped hair makes it damaging instead
- Different from low-manipulation styles (wash-and-gos, twist outs worn loose) which leave hair out but minimize daily handling
- Common protective styles: cornrows, top knots, Bantu knots, box braids, crochet braids, Senegalese twists, pineapples, wigs, flat twists, faux locs, Marley twists, mini twists, two braids
- A protective style becomes a "prison" instead of protection when: you stop moisturizing, stop washing, stop accessing the scalp, or treat preserving the style as more important than the hair underneath

How can you tell if a protective style is working (or not)?
Working:
- Scalp feels comfortable, hair stays moisturized, no pain, no scalp irritation, edges stay healthy, hair is retaining length over time
Not working / too tight:
- Scalp pain that lasts more than 24 hours after install
- White bumps along the hairline (early sign of follicle stress)
- Visible thinning at edges (traction is causing damage)
- Severe itching that doesn't respond to scalp oil
Not protective enough:
- Hair feels dry or brittle
- You can't access your scalp to moisturize
- You're skipping washes because of the style
- You're not wearing a bonnet at night
- Synthetic hair is drying out your natural hair`,

  strength: `STRENGTH & BREAKAGE REDUCTION:
- Protein treatments rebuild the hair's keratin structure every 4-6 weeks
- Always deep condition after protein to maintain the moisture-protein balance
- Never brush wet hair — finger detangle first, then use a wide-tooth comb
- Use seamless combs and satin-lined accessories
- Avoid heat; if used, never exceed 350°F and always apply heat protectant

Ingredients to look for to prevent hair breakage:
- Honey (humectant)
- Jojoba oil
- Argan oil
- Aloe vera
- Coconut oil (also reduces hydro fatigue, supports moisture retention, reduces protein loss)
- Shea butter
- Avocado oil
- Sweet almond oil
- Olive oil
- Apple cider vinegar
- Natural oils generally
- Protein for protein treatments (when hair is weak)
- Bond-building ingredients (for repairing broken hair bonds)
- Gentle cleansing surfactants (look for cocoyl or sodium cocoyl ingredients in the top 4-5 on the label)
- Ingredients/products to avoid: sulfates (strip natural oils, leave hair dry and brittle), parabens, phthalates, harsh chemicals — relaxers, perms, bleach, hair dye, keratin treatments, drying ingredients in general, heavy oils when adding heat (essentially cooks the hair), toxic ingredients that dry out hair and reduce elasticity

Positives of recognizing and treating hair breakage:
- Once you know what's causing the breakage, you can stop it and restore your hair
- Not everyone has to chop hair to deal with breakage — it can often be reversed
- Recognizing breakage early helps you retain length instead of losing it
- Fixing breakage habits leads to thicker, fuller-looking hair
- Properly cared-for hair retains length over time
- Reduced breakage means visible growth showing on your head
- Acting on breakage now prevents permanent damage (like alopecia)
- Breakage is unavoidable to some extent, but it can absolutely be minimized

How to moisturize hair to prevent breakage:
- Use a hydrating shampoo (water/moisture-rich) instead of stripping ones
- Deep condition every wash day if hair is super dry
- Use the LCO method (Liquid → Cream → Oil)
- Moisturize and seal — water-based moisturizer first, then oil to lock it in
- Use leave-in conditioners or hydrating mists daily
- Apply hair masks or deep conditioning treatments 1-2 times per month for an extra boost
- Pre-poo treatments before shampoo (coconut oil specifically reduces protein loss and supports moisture retention)
- Hot oil treatments with avocado, olive, or sweet almond oil — leave on 15-20 minutes, then rinse and condition
- Hair steam treatments — apply leave-in/mask/oil, then steam for 10-20 minutes to help moisture penetrate
- For low porosity hair: use steam during deep conditioning
- Drink water — internal hydration affects hair health
- Spray water + conditioner mix before detangling to prevent dry detangling damage

How to avoid over-moisturizing while preventing breakage:
- Don't pile on heavy oils when using heat (combination essentially cooks the hair)
- Watch for moisture overload — limp, shapeless hair signals too much moisture and not enough protein
- Don't pile heavy butters and oils onto fine or low-density hair (causes buildup, weighs down strands)
- Balance moisture with protein — both are needed; too much of either causes breakage
- Don't detangle hair when it's sopping wet (hair is most fragile in this state) OR completely dry (least elastic) — damp is ideal
- Don't oil scalp on a regular basis if you have buildup — it can suffocate follicles

Maintaining long-term hair health to prevent breakage:
- Cut out heat — the only way to fix heat damage is to stop using heat
- If you must heat style, always use a heat protectant and use the right temperature (not too high, not too low)
- Don't comb hair every day — over-manipulation is one of the top causes of breakage
- Use a wide-tooth comb, detangling brush, or fingers — never small rat-tail combs on textured hair
- Detangle gently in sections, ends to roots, when hair is damp and saturated with conditioner
- Reduce the number of detangling stages in your routine to a maximum of two
- Never detangle dry hair — biggest cause of snap breakage
- Don't rush — patience prevents breakage
- Use silk scrunchies, claw clips, banana clips for daily updos (no tight rubber bands or ponytails)
- Don't pull hair into the same tight style repeatedly (creates breakage exactly where the tension sits)
- Wear a bonnet, satin scarf, or sleep on a silk/satin pillowcase every night (cotton dries hair out and causes friction breakage)
- Don't wear hair down all the time — cotton clothing rubs and breaks strands
- Use protective styles (box braids, two-strand twists, Bantu knots, cornrows, Fulani braids) — but install them gently, not too tight; if it hurts, it's not protective
- Don't leave protective styles in longer than 5-8 weeks
- Continue moisturizing and caring for hair underneath protective styles
- Get regular trims based on need (when ends look thin, feel rough, or have split ends), generally every 8-12 weeks; every 3-4 months for some
- Use protein treatments when hair feels weak (especially after relaxers, bleach, heat damage)
- Try bond builders to repair the internal hair structure (works from the inside)
- Alternate hydrating and protein deep conditioners every other wash if hair is dry AND weak
- Use a microfiber towel or cotton t-shirt — never a regular bathroom towel
- Seal ends daily with a drop of oil (your ends are the oldest, most vulnerable part of your strand)
- Eat a nutrient-rich diet — undernourished hair is less elastic and breaks easily
- Don't crash diet or under-eat protein — the body deprioritizes hair when nutrition is low
- Manage stress — chronic stress is a major cause of breakage, thinning, balding, and graying
- Wash hair regularly (weekly or bi-weekly) — clean hair grows healthier hair
- Stick with one routine and one set of products long enough to see results — switching constantly prevents progress
- Reduce manipulation overall — fewer hands in your hair means fewer broken strands

What is hair breakage?
- Hair breakage is what happens when a hair strand snaps under tension it can't withstand — you lose part of the length of that strand, with part remaining on your scalp
- Can be distinguished from natural shedding because broken hairs are SHORTER than your normal hair length AND lack the small white bulb at the end (which is characteristic of normal shedding)
- Caused by two main factors: low elasticity (hair isn't stretchy enough, so it breaks under tension) and environmental stress (anything that puts tension on hair in the first place)
- Common signs: hair that doesn't grow past a certain length, see-through ends, thinning hair, constant snapping sound when combing, short hairs in the sink after styling
- Often caused by: heat damage, chemical damage (relaxers, perms, dye, bleach), over-manipulation (too much combing/styling), friction (cotton fabrics, wearing hair down constantly), insufficient moisture, insufficient protein, tight hairstyles, poor diet, stress, improper hair care
- When hair bonds break (from heat, chemicals, manipulation), the "ladder" of the hair shaft breaks, making strands weak and prone to snapping
- Breakage is normal in small amounts but should be minimized
- Different from hair loss — breakage happens along the strand, hair loss/shedding happens from the root

How can you tell if your hair is breaking?
- Hair "snaps" sound when combing or detangling
- See-through ends
- Hair that seems "stuck" at one length, won't grow past a certain point
- Thinning hair, especially toward the ends
- Short hairs in the sink, on your shirt, in your brush, or on the floor after styling
- Hairs without a white bulb at the end (vs. shed hairs, which have a small white bulb)
- Hair feels rough, brittle, or straw-like
- Ends look frayed, jagged, or split
- Visible breakage around hairline edges (especially from tight ponytails or hairstyles)
- Hair feels weak when stretched — snaps easily instead of stretching and bouncing back
- Hair feels hard, stiff, or unmanageable (signs of low moisture, too much protein, or both)
- Hair feels limp, shapeless, or mushy (signs of too much moisture, not enough protein)
- Curl pattern has straightened out (could be heat damage)
- Patches of shorter hair on your head — especially around the crown or where ponytails sit`,

  scalp_health: `SCALP HEALTH:
- Regular scalp massages improve blood flow and product absorption
- Apple cider vinegar rinse (diluted 1:3) balances scalp pH
- Wash frequently enough to keep follicles clear but not so often that oils are stripped
- Tea tree, peppermint, and rosemary oils support a healthy scalp environment
- Identify irritating ingredients and avoid them consistently

Ingredients to look for for scalp care:
- Rosemary (supports scalp health, stronger-looking hair over time)
- Cloves (rich in antioxidants, supports circulation)
- Peppermint
- Lavender (combats dandruff and inflammation)
- Lemon (clarifying)
- Pea peptides (stimulate hair follicles, clarify scalp from buildup)
- Micellar water (gentle surfactant for daily cleansing)
- AHAs (chemical exfoliation for scalp)
- Hyaluronic acid (hydration)
- Squalane (hydration)
- Skincare-style ingredients (the "skinification" of haircare)
- Lightweight botanical extracts
- Ingredients/products to avoid: sulfates that over-strip, heavy oils applied directly to the scalp (clog pores, attract dirt and debris around hair shafts, get stuck and cause blockages), harsh edge controls used long-term (cause hairline damage), heavy dry shampoos designed for grease absorption (textured hair needs buildup removal, not grease absorption)

Positives of healthy scalp care:
- The scalp is the foundation of hair health — a healthy scalp leads to healthy hair follicles and healthy hair
- Properly cared-for scalp prevents dermatitis, itching, inflammation, breakage, hair loss, and scalp infections
- Allows hair to thrive in length and density
- Reduces shedding (ideally only a quarter-sized amount per wash if shampooing weekly)
- Reduces or prevents traction alopecia and edge thinning
- Sebum production stays balanced when scalp is properly cared for
- The scalp is skin — treating it like skin gives it the consistent care that produces visible results
- A clean, exfoliated, well-circulated scalp encourages follicles to function optimally

How to moisturize and keep a healthy scalp hydrated:
- Use lightweight hair serums on the scalp (less heavy than oils, more concentrated nutrients)
- Apply serums between wash days to lock in moisture, soothe irritation, and stimulate growth where thinning occurs
- Use a daily light leave-in conditioner that doesn't break your style or weigh hair down
- Steam during deep conditioning — stay in the steam as long as possible, especially for low porosity hair
- A facial steamer works if a hair steamer is too expensive
- Use a silicone scalp brush during shampoo to stimulate blood flow and ensure shampoo reaches the scalp
- Drink rosemary + clove herbal tea infusions (or spritz on scalp) — supports scalp health from inside and outside
- For braids/protective styles: use hair serums as a "spot treatment" to prevent hair loss and itching, especially when using edge control

How to avoid over-moisturizing the scalp:
- Don't apply oil directly to the scalp — it can clog pores, attract dirt and debris around hair shafts, and cause buildup that blocks follicles (this is one of the most overlooked mistakes)
- Apply oil to the hair shaft (lengths), not the scalp
- Use lightweight serums on the scalp instead of heavy oils
- Avoid over-washing — but don't fear regular washing either (1-2 times per week is fine for most)
- Clarify regularly to break down buildup before it accumulates
- Don't layer too many heavy products
- Watch for signs of buildup: scalp itchiness, white residue, dullness, lack of product absorption

Maintaining long-term scalp health:
- Cleanse regularly — most shampoos are designed for the scalp (not the hair); conditioner is what's for the hair
- Wash at least once a week; some sources say more often is actually better, not worse
- Use a daily cleanser between wash days — micellar water (gentle surfactant) or a scalp cleanser/scalp scrub
- Don't fear washing — fear of over-stripping has caused many people to neglect their scalps
- Find a gentle, sulfate-free shampoo that doesn't over-strip
- Add a scalp serum to your routine (skincare-style — concentrated nutrients delivered directly)
- Use a silicone scalp brush during shampoo for blood flow stimulation and thorough cleansing
- Scalp massages improve circulation
- Use a quality detangling brush to minimize shedding during detangling
- Detangle in sections from ends to roots, with conditioner and water
- Pay attention to how much you're shedding on wash day — quarter-sized amount per weekly wash is normal; more than that is a warning sign
- Use a dermastamp (not a dermaroller) if doing scalp microneedling for growth — the roller can rip hairs out as it moves; the stamp goes straight in and out
- Treat your scalp the same way you treat your face — daily attention, consistency, dedicated products
- Consider getting a professional scalp analysis to understand your scalp's actual condition (hydration, density, pore state, sensitivity, uniformity)
- Get a trichology appointment if you're experiencing scalp issues you can't resolve at home
- Don't wear protective styles or wigs without continuing to care for your scalp underneath
- For Black women specifically, scalp care has historically been deprioritized in favor of moisturizing — but the truth is moisturizing alone won't grow healthy hair without scalp care
- See a dermatologist or trichologist if scalp issues persist

What is scalp care?
- A complete routine for maintaining the skin on your head, where your hair grows from
- Includes cleansing, exfoliating, hydrating, nourishing, and protecting the scalp
- Recognizes that scalp = skin, and that the same level of care you give your face should be given to your scalp
- A growing movement in the natural hair space called the "skinification" of haircare
- Aims to prevent issues like dermatitis, itchy/inflamed scalp, hair breakage, hair loss, and scalp infections
- Designed to balance sebum production, which is typically underproduced in afro hair (it takes longer for natural oils to build up on coily hair)
- Includes daily and weekly habits: cleansing, serums, leave-ins, massages, steaming, and protection

How can you tell if your scalp is healthy or unhealthy?
Healthy scalp signs:
- Uniform appearance, no irritation or redness, no signs of dandruff, balanced hydration, clear pores, good hair density, no flaking, no itching, no scalp pain, hair retains length over time
Unhealthy scalp signs:
- Dryness or flaking
- Itching or burning
- Redness or visible irritation
- White bumps along hairline
- Excessive shedding (more than a quarter-sized amount per weekly wash)
- Buildup on the scalp
- Hair thinning or breakage
- Hair not retaining length
- Scalp pain or tenderness
- Tight, inflamed feeling
- Slow or stalled hair growth
- Consider a professional scalp analysis to check uniformity, sensitivity, pore state, hydration, and density`,
};

export function buildHairKnowledge(profile: HairProfileData): string {
  const { questionnaireAnswers, hairGoals } = profile;
  const sections: string[] = [
    'HAIR CARE KNOWLEDGE BASE (relevant to this user):',
    LOC_LCO_KNOWLEDGE,
    PRODUCTS_TO_AVOID,
  ];

  if (POROSITY_KNOWLEDGE[questionnaireAnswers.porosity]) {
    sections.push(POROSITY_KNOWLEDGE[questionnaireAnswers.porosity]);
  }
  if (CURL_PATTERN_KNOWLEDGE[questionnaireAnswers.curl_pattern]) {
    sections.push(CURL_PATTERN_KNOWLEDGE[questionnaireAnswers.curl_pattern]);
  }
  if (SCALP_KNOWLEDGE[questionnaireAnswers.scalp]) {
    sections.push(SCALP_KNOWLEDGE[questionnaireAnswers.scalp]);
  }
  for (const goal of hairGoals) {
    if (GOAL_KNOWLEDGE[goal]) sections.push(GOAL_KNOWLEDGE[goal]);
  }

  return sections.join('\n\n');
}

/*
SOURCES:
HIGH POROSITY:
https://patternbeauty.com/blogs/news/highly-porous-hair
https://www.glowbydaye.com/blogs/glow-by-daye/tips-to-maintain-hair-moisture-in-the-summer-based-on-your-porosity

MEDIUM POROSITY:
https://www.ouidad.com/blogs/curl-talk/all-about-porosity
https://curlsmith.com/blogs/curl-academy/medium-porosity-hair-guide
https://theorganibrands.com/blogs/news/product-selection-for-your-hair-porosity-matching-the-right-ingredients-1
https://theradome.com/blogs/blog/what-is-medium-porosity-hair
https://www.redken.com/blog/what-is-your-hair-porosity.html
https://www.healthline.com/health/hair-porosity

LOW POROSITY:
https://www.healthline.com/health/low-porosity-hair
https://carolsdaughter.com/blogs/beauty-blog/everything-you-need-to-know-about-low-porosity-hair

TYPE 3A: https://www.vogue.com/article/a-guide-to-3a-hair-curl-pattern
TYPE 3B: https://www.byrdie.com/type-3b-hair-what-it-is-and-how-to-care-for-it-5225581
TYPE 3C: https://prose.com/blog/guide-to-3c-hair
TYPE 4A: https://patternbeauty.com/blogs/news/4a-hair
TYPE 4B: https://lohy.com.au/pages/4b-hair-type | https://carolsdaughter.com/blogs/beauty-blog/type-4b-hair-how-to-care-for-4b-curls | https://patternbeauty.com/blogs/news/4b-hair
TYPE 4C: https://asiamnaturally.com/blogs/news/how-to-care-for-4c-hair | https://mielleorganics.com/blogs/texture-toolkit/what-is-4c-hair-type
Academic ref: Syed, A. N. (2023). Curly Hair: Structure, Properties, & Care. Avlon Industries.

DRY SCALP: https://curlsmith.com/blogs/scalp-health/dandruff-vs-dry-scalp-comparison-guide | https://boucleme.us/blogs/news/how-to-treat-dry-scalp-and-dandruff-for-curly-hair
OILY SCALP: https://www.ayanae.com/blogs/all-post/how-to-care-for-an-oily-scalp-with-coily-and-curly-hair | https://uk.curlsmith.com/blogs/tips-tricks/oily-hair-guide
BALANCED SCALP: https://curlsmith.com/blogs/scalp-health/healthy-scalp-tips | https://natureslittlesecret.net/blogs/healthy-hair-education/healthy-scalp-healthy-hair-the-ultimate-guide
SENSITIVE SCALP: https://zaphiranature.com/blogs/curl-advice/best-haircare-routine-for-sensitive-scalps

MOISTURE/HYDRATION: https://www.afrotherapysalon.com/news/how-to-moisturise-dry-natural-afro-hair/
HAIR GROWTH: https://carolsdaughter.com/blogs/beauty-blog/how-to-grow-natural-hair
CURL DEFINITION: https://curlsmith.com/blogs/tips-tricks/how-to-get-defined-curls | https://www.blackbeautyandhair.com/curl-definition-for-4c-hair-is-possible/
PROTECTIVE STYLE CARE: https://mielleorganics.com/blogs/texture-toolkit/10-protective-styles-for-hair-growth | https://carolsdaughter.com/blogs/beauty-blog/your-guide-to-protective-hairstyles-for-natural-hair
STRENGTH & BREAKAGE: https://naturallclub.com/blogs/the-naturall-club-blog/10-ways-to-reduce-breakage | https://patternbeauty.com/blogs/news/how-to-prevent-natural-hair-breakage-6-tips-for-stronger-strands
SCALP HEALTH: https://curlsmith.com/blogs/scalp-health/healthy-scalp-tips | https://www.refinery29.com/en-us/2023/07/11462424/scalp-analysis-natural-hair-tips
*/

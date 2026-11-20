const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect, adminOnly } = require("../middleware/auth");

// Initial sample articles for seeding if DB is empty (Written in Roman English / Roman Urdu)
const initialArticles = [
  {
    oldTitle: "The Regal Nukra Horse: Pakistan's Icon of Prestige",
    title: "Shahi Nukra Ghora: Pakistan Ki Shaan Aur Izzat Ka Nishan",
    category: "Breeds",
    author: "Malik Shahzad",
    readTime: "5 min read",
    summary: "Apni chamakdar safaid jild aur gulabi rangat ki waja se, Nukra ghore Punjab ke shahi melaon, shadiyon aur tehwaro me numayan muqam rakhte hain.",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    content: [
      "Nukra ghora sirf aik nasal nahi hai, balkay yeh Pakistan, khas tor par Punjab ke zarkhez maidanon me saqafat, fakhar aur shaan o shaukat ki zinda misaal hai. Iski pehchan iska shafaf safaid rang, safaid baal, gulabi jild aur chamakdar aankhein hain. Desi equine culture me iski gulabi jild ko bohot khoobsurti se 'phulkari' kaha jata hai.",
      "Genetic aitabar se, Nukra ghoray ka shandar safaid rang double-sabino genes ka nateeja hota hai. Pakistan ke equine breeders isay aik mukammal alag class maantay hain, jabke experts ke mutabiq yeh Sindhi aur Chamba naslon ke sath bhi gehra connection rakhta hai. Yeh ghore nihayat chust, hoshyar aur roabdar chaal dhaal ke malik hotay hain.",
      "Pakistan ke riwayati melay aur tehwar Nukra ghoron ke baghair adhoore hain. Inhein makhsoos dhol ki thaap par nachnay (horse dance) aur Nezabazi ke shandar muzahiron ke liye train kiya jata hai. Nukra ghore ka maalik hona khandani shaan aur izzat samjha jata hai, aur yeh Lahore Horse & Cattle Show jese qoumi events ka markazi hissa hotay hain."
    ]
  },
  {
    oldTitle: "The Legendary Anmol Breed: Pakistan's Ancient Horse Heritage",
    title: "Tareekhi Anmol Nasal: Pakistan Ka Qadeem Equine Virsa",
    category: "Breeds",
    author: "Dr. Tariq Mahmood",
    readTime: "7 min read",
    summary: "Qadeem Anmol nasal ki tareekh, aur insaan aur ghoray ke sadiyon puranay rishtay aur Pakistan ki shandar saqafat ka jaiza.",
    image: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800",
    content: [
      "Ghoray aur insaan ka rishta Punjab aur Pakistan ki tareekh aur saqafat me sadiyon purana aur bohot gehra hai. Sadiyon se yeh shandar janwar sirf safar ka zariya nahi rahay, balkay bahadur jangjuon ke wafadar saathi, nawabon aur sardaron ki shaan, aur Nezabazi (tent pegging) ke champions rahay hain. Yeh tareekhi rishta wafadari, ghairat aur ba-bahami ehtaram ki azeem dastaan hai.",
      "'Anmol' (jis ka lafzi matlab la-jawab ya be-qeemat hai) bare-sagheer aur Pakistan ki aik nihayat qadeem aur nayab equine nasal hai. Tareekhi riwayat ke mutabiq Anmol nasal ka silsila Sikandar-e-Azam (Alexander the Great) ke daryaye Jhelum ke maarkay se milta hai, jahan muqami ghoron ko Arabi aur Irani naslon ke sath cross kiya gaya tha.",
      "Anmol ghore apne chamakdar kumait (bay) ya samand (chestnut) rang, mazboot pathon, aur sakht garmi aur dhoop me be-misaal stamina ke liye mashhoor hain. Jadeed racing ghoron ke muqablay me Anmol ghora mukhtasir khuraak par lamba fasla tay karne ki shandar salahiyat rakhta hai.",
      "Aaj kal, Punjab aur Khyber Pakhtunkhwa ke pur-khaloos breeders Anmol nasal ki hifazat aur iski asal bloodline ko dobarah zinda karne ke liye din raat mehnat kar rahay hain, taake Pakistan ka yeh tareekhi sarmaya hamesha mehfooz rahay."
    ]
  },
  {
    oldTitle: "Essential Equine Nutrition & Daily Diet Guidelines",
    title: "Ghoron Ki Behtareen Khuraak Aur Rozmarra Diet Ke Assool",
    category: "Equine Care",
    author: "Vet. Bilal Ahmed",
    readTime: "4 min read",
    summary: "Ghoron ki sehat, paani ki miqdaar aur tawazan wali ghiza ka mukammal rehnuma guide taake aapka ghora hamesha tandrust aur taqatwar rahay.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
    content: [
      "Munassib aur tawazan wali ghiza ghoray ki tandrusti aur behtareen kar-kardagi ki bunyad hai. Ghoray ka nizam-e-inhazam (digestive system) din bhar halki halki fiber wali khuraak hazam karne ke liye bana hai. Achi quality ka hara chara ya sookhi ghaas (hay) ghoray ke kul wazan ka 1.5% se 2% rozana hona zaroori hai. Misaal ke tor par, 500kg wazan ke ghoray ko rozana 7.5 se 10kg chara darkaar hota hai.",
      "Saaf aur taaza paani har waqt ghoray ki pohanch me hona chahiye. Aik aam ghora din me 20 se 50 liter paani peeta hai, aur garmiyon ya sakht mehnat me yeh miqdaar mazeed barh jati hai. Paani ki kami ghoron me 'Colic' (pet dard) ki sab se bari waja banti hai jo ke janlewa sabit ho sakti hai.",
      "Hara chara bunyadi tawanai deta hai, lekin active stallions, ghaban madiyon (pregnant mares) aur chotay bachedon (foals) ke liye protein aur grains (jaee/oats, jow/barley) aur namak/mineral blocks bohot zaroori hain. Ghoray ki khuraak me tabdeeli hamesha aahista aahista 7 se 10 dino me karein taake pet ke masail aur bimariyon se bacha ja sakay."
    ]
  },
  {
    title: "Pakistan Me Nezabazi Aur Shahi Equine Melay",
    category: "Events",
    author: "Chaudhry Kamran",
    readTime: "5 min read",
    summary: "Punjab aur KPK ke maidanon me dhol ki thaap, tezz tareen gallop aur Nezabazi ke shandar muqablon ki dastaan.",
    image: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&q=80&w=800",
    content: [
      "Nezabazi (Tent Pegging) Pakistan ka qoumi aur saqafati equestrian khel hai jis me ghursawar poori raftaar se gallop karte hue zameen par lagay lakri ke peg ko barchhi (lance) se uthate hain. Yeh khel ghursawar aur ghoray ke darmiyan be-panah rabtay aur yaqeen ki nishani hai.",
      "Faisalabad, Sargodha, Sahiwal, Chakwal aur Hafizabad ke ilaqon me saalana melaon me hazaron shaiqeen jama hote hain jahan Desi aur Nukra ghore apni tezi aur balance ka shandar muzahira karte hain. Dhol ki thaap par ghoron ka nach aur sawaar ki maharat dekhne se taaluq rakhti hai.",
      "Horse-Square Pakistan in tamam riwayati melo aur registered riding clubs ko digitally connect kar raha hai taake har ghursawar aur equine lover ko behtareen platform aur maloomat mil sakay."
    ]
  }
];

// GET /api/blogs (Public - fetch all blog posts)
router.get("/", async (req, res) => {
  try {
    let blogs = await Blog.find().sort({ createdAt: -1 });

    // Seed initial blogs if DB is empty
    if (blogs.length === 0) {
      blogs = await Blog.insertMany(initialArticles);
    } else {
      // Auto-migrate any existing English seed articles to Roman English
      for (const initial of initialArticles) {
        if (initial.oldTitle) {
          await Blog.updateOne(
            { title: initial.oldTitle },
            {
              $set: {
                title: initial.title,
                summary: initial.summary,
                content: initial.content,
                category: initial.category,
                readTime: initial.readTime,
                image: initial.image,
                author: initial.author
              }
            }
          );
        }
      }
      blogs = await Blog.find().sort({ createdAt: -1 });
    }

    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching blog posts", error: err.message });
  }
});

// GET /api/blogs/:id (Public - fetch single blog post)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching blog post", error: err.message });
  }
});

// POST /api/blogs (Admin Only - create new blog post)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, category, author, readTime, summary, image, content } = req.body;
    if (!title || !summary || !image || !content) {
      return res.status(400).json({ success: false, message: "Title, summary, image, and content are required." });
    }

    const contentArray = Array.isArray(content)
      ? content
      : String(content).split('\n\n').map(p => p.trim()).filter(Boolean);

    const newBlog = await Blog.create({
      title,
      category: category || "Equine Care",
      author: author || req.user.name || "Admin",
      readTime: readTime || "5 min read",
      summary,
      image,
      content: contentArray
    });

    res.status(201).json({ success: true, message: "Blog article published successfully!", data: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating blog article", error: err.message });
  }
});

// DELETE /api/blogs/:id (Admin Only - delete blog post)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, message: "Blog article deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting blog article", error: err.message });
  }
});

module.exports = router;

import { db } from "../../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

// fungsi slugify untuk ID toko
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nama_toko, logo, produk, harga, kategori } = req.body;

    // slugify nama toko → jadi ID di Firestore
    const tokoId = slugify(nama_toko);

    // simpan toko
    await setDoc(doc(db, "toko", tokoId), {
      nama: nama_toko,
      logo: logo || "",
    });

    // simpan produk di subcollection
    await addDoc(collection(db, "toko", tokoId, "produk"), {
      nama: produk,
      harga: parseInt(harga),
      kategori: kategori || "Lainnya",
    });

    return res.status(200).json({
      message: "Toko berhasil ditambahkan",
      link: `https://warunginstan.vercel.app/${tokoId}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

import { db } from "../../firebase";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";

// fungsi slugify untuk ID toko (nama_toko → warung-bu-ani)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // spasi → "-"
    .replace(/[^\w\-]+/g, "")   // hapus karakter aneh
    .replace(/\-\-+/g, "-");    // hapus strip ganda
}

// fungsi normalisasi harga
function parseHarga(input) {
  if (!input) return 0;

  let clean = String(input).toLowerCase().trim();

  // kalau ada kata "ribu"
  if (clean.includes("ribu")) {
    const angka = parseInt(clean.replace(/[^\d]/g, "")) || 0;
    return angka * 1000;
  }

  // default: ambil digit aja (buang Rp, titik, spasi)
  return parseInt(clean.replace(/\D/g, "")) || 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nama_toko, logo, produk, harga, kategori } = req.body;

    if (!nama_toko || !produk) {
      return res.status(400).json({ error: "Nama toko dan produk wajib diisi" });
    }

    const tokoId = slugify(nama_toko);

    // cek apakah toko sudah ada
    const tokoRef = doc(db, "toko", tokoId);
    const tokoSnap = await getDoc(tokoRef);

    if (!tokoSnap.exists()) {
      // buat dokumen toko kalau belum ada
      await setDoc(tokoRef, {
        nama: nama_toko,
        logo: logo || "",
        dibuat: new Date().toISOString(),
      });
    }

    // simpan produk baru di subcollection
    const cleanHarga = parseHarga(harga);

    await addDoc(collection(db, "toko", tokoId, "produk"), {
      nama: produk,
      harga: cleanHarga,
      kategori: kategori || "Lainnya",
      dibuat: new Date().toISOString(),
    });

    // ambil base domain otomatis (bisa lokal, vercel, atau custom domain)
    const baseUrl = `https://${req.headers.host}`;

    return res.status(200).json({
      message: "Toko & produk berhasil ditambahkan 🎉",
      link: `${baseUrl}/${tokoId}`,
    });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

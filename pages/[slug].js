import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// Fungsi slugify → ubah "Toko Bu Sri" jadi "toko-bu-sri"
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // ganti spasi jadi "-"
    .replace(/[^\w\-]+/g, "")   // hapus karakter aneh
    .replace(/\-\-+/g, "-");    // hapus strip ganda
}

export default function TokoPage({ data, produk }) {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">Toko tidak ditemukan ❌</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Nama Toko */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">{data.nama}</h1>
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo Toko"
              className="w-32 h-32 mt-6 mx-auto rounded-full border-4 border-gray-300 shadow-md"
            />
          )}
        </div>

        {/* Produk */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Katalog Produk</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {produk.map((p, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900">{p.nama}</h3>
              <p className="text-blue-600 font-bold mt-1">Rp {p.harga}</p>
              <p className="text-sm text-gray-500 italic mt-1">{p.kategori}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ambil data berdasarkan slug (nama toko di URL)
export async function getServerSideProps({ params }) {
  const rawSlug = params.slug;         // contoh: "Toko Bu Sri"
  const cleanSlug = slugify(rawSlug);  // jadi "toko-bu-sri"

  const tokoRef = doc(db, "toko", cleanSlug);
  const tokoSnap = await getDoc(tokoRef);

  if (!tokoSnap.exists()) {
    return { props: { data: null, produk: [] } };
  }

  const data = tokoSnap.data();

  // ambil produk dari subcollection
  const produkRef = collection(db, "toko", cleanSlug, "produk");
  const produkSnap = await getDocs(produkRef);

  const produk = produkSnap.docs.map((doc) => doc.data());

  return { props: { data, produk } };
}

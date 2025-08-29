import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [toko, setToko] = useState(null);
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // ambil data toko
      const tokoRef = doc(db, "toko", "warung-bu-ani");
      const tokoSnap = await getDoc(tokoRef);

      if (tokoSnap.exists()) {
        setToko(tokoSnap.data());

        // ambil produk dari subcollection
        const produkRef = collection(db, "toko", "warung-bu-ani", "produk");
        const produkSnap = await getDocs(produkRef);

        const produkList = produkSnap.docs.map((doc) => doc.data());
        setProduk(produkList);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      {toko ? (
        <div className="max-w-4xl mx-auto">
          {/* Nama Toko */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {toko.nama}
            </h1>
            {toko.logo && (
              <img
                src={toko.logo}
                alt="Logo Toko"
                className="w-32 h-32 mt-6 mx-auto rounded-full border-4 border-gray-300 shadow-md"
              />
            )}
          </div>

          {/* Produk */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Katalog Produk
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {produk.map((p, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.nama}
                </h3>
                <p className="text-blue-600 font-bold mt-1">Rp {p.harga}</p>
                <p className="text-sm text-gray-500 italic mt-1">
                  {p.kategori}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Memuat data toko...</p>
      )}
    </div>
  );
}
